from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import Optional
import json

from app.db.database import get_session
from app.models.session import InterviewSession, AnswerRecord, SessionStatus
from app.models.background import Background
from app.schemas.interview import (
    StartSessionRequest, SessionResponse, SessionMode,
    AnswerSubmission, FeedbackResponse, SessionSummary, AnswerRecordResponse
)
from app.schemas.question import QuestionType
from app.services.question_generator import QuestionGenerator
from app.services.star_evaluator import STAREvaluator

router = APIRouter()


@router.post("/start", response_model=SessionResponse)
async def start_session(
    data: StartSessionRequest,
    session: AsyncSession = Depends(get_session)
):
    # Verify background exists
    result = await session.execute(
        select(Background).where(Background.id == data.background_id)
    )
    background = result.scalar_one_or_none()
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    
    # Generate questions
    generator = QuestionGenerator()
    
    background_text = None
    if background.resume_text:
        background_text = background.resume_text
    
    questions = await generator.generate_questions(
        background_text=background_text,
        question_types=[QuestionType.BEHAVIORAL],
        count=data.question_count
    )
    
    # Create session
    interview_session = InterviewSession(
        mode=data.mode.value,
        background_id=data.background_id,
        job_description_id=data.job_description_id,
        questions_json=json.dumps([q.model_dump() for q in questions]),
        current_question_index=0,
        status=SessionStatus.ACTIVE.value
    )
    session.add(interview_session)
    await session.commit()
    await session.refresh(interview_session)
    
    return SessionResponse(
        id=interview_session.id,
        mode=SessionMode(interview_session.mode),
        background_id=interview_session.background_id,
        job_description_id=interview_session.job_description_id,
        questions=interview_session.questions,
        current_question_index=interview_session.current_question_index,
        status=SessionStatus(interview_session.status),
        created_at=interview_session.created_at
    )


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session_state(
    session_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    interview_session = result.scalar_one_or_none()
    
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SessionResponse(
        id=interview_session.id,
        mode=SessionMode(interview_session.mode),
        background_id=interview_session.background_id,
        job_description_id=interview_session.job_description_id,
        questions=interview_session.questions,
        current_question_index=interview_session.current_question_index,
        status=SessionStatus(interview_session.status),
        created_at=interview_session.created_at
    )


@router.post("/{session_id}/answer", response_model=FeedbackResponse)
async def submit_answer(
    session_id: str,
    data: AnswerSubmission,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    interview_session = result.scalar_one_or_none()
    
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if interview_session.status != SessionStatus.ACTIVE.value:
        raise HTTPException(status_code=400, detail="Session is not active")
    
    questions = interview_session.questions
    current_idx = interview_session.current_question_index
    
    if current_idx >= len(questions):
        raise HTTPException(status_code=400, detail="No more questions")
    
    current_question = questions[current_idx]
    
    # Evaluate the answer
    evaluator = STAREvaluator()
    feedback = await evaluator.evaluate_answer(
        question=current_question["text"],
        answer=data.answer_text
    )
    
    # Save the answer record
    answer_record = AnswerRecord(
        session_id=session_id,
        question_id=current_question["id"],
        question_text=current_question["text"],
        answer_text=data.answer_text,
        overall_score=feedback.overall_score,
        feedback_json=json.dumps(feedback.model_dump())
    )
    session.add(answer_record)
    await session.commit()
    
    return feedback


@router.post("/{session_id}/next", response_model=dict)
async def next_question(
    session_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    interview_session = result.scalar_one_or_none()
    
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    questions = interview_session.questions
    next_idx = interview_session.current_question_index + 1
    
    if next_idx >= len(questions):
        interview_session.status = SessionStatus.COMPLETED.value
        session.add(interview_session)
        await session.commit()
        return {"completed": True, "message": "All questions answered"}
    
    interview_session.current_question_index = next_idx
    session.add(interview_session)
    await session.commit()
    
    return {
        "completed": False,
        "question_index": next_idx,
        "question": questions[next_idx]
    }


@router.post("/{session_id}/end", response_model=SessionSummary)
async def end_session(
    session_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    interview_session = result.scalar_one_or_none()
    
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    interview_session.status = SessionStatus.COMPLETED.value
    session.add(interview_session)
    
    # Fetch all answers
    answers_result = await session.execute(
        select(AnswerRecord).where(AnswerRecord.session_id == session_id)
    )
    answers = answers_result.scalars().all()
    
    await session.commit()
    
    # Calculate average score
    scores = [a.overall_score for a in answers if a.overall_score is not None]
    avg_score = sum(scores) / len(scores) if scores else None
    
    return SessionSummary(
        session_id=session_id,
        total_questions=len(interview_session.questions),
        questions_answered=len(answers),
        average_score=avg_score,
        answers=[
            AnswerRecordResponse(
                id=a.id,
                question_id=a.question_id,
                question_text=a.question_text,
                answer_text=a.answer_text,
                overall_score=a.overall_score,
                feedback=a.feedback,
                created_at=a.created_at
            ) for a in answers
        ]
    )