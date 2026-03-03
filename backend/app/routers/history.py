from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List

from app.db.database import get_session
from app.models.session import InterviewSession, AnswerRecord
from app.schemas.interview import SessionSummary, AnswerRecordResponse

router = APIRouter()


@router.get("", response_model=List[dict])
async def get_session_history(
    background_id: str = None,
    limit: int = 20,
    session: AsyncSession = Depends(get_session)
):
    query = select(InterviewSession).order_by(InterviewSession.created_at.desc()).limit(limit)
    
    if background_id:
        query = query.where(InterviewSession.background_id == background_id)
    
    result = await session.execute(query)
    sessions = result.scalars().all()
    
    history = []
    for s in sessions:
        # Get answers for this session
        answers_result = await session.execute(
            select(AnswerRecord).where(AnswerRecord.session_id == s.id)
        )
        answers = answers_result.scalars().all()
        
        scores = [a.overall_score for a in answers if a.overall_score]
        avg_score = sum(scores) / len(scores) if scores else None
        
        history.append({
            "id": s.id,
            "mode": s.mode,
            "status": s.status,
            "questions_count": len(s.questions),
            "answers_count": len(answers),
            "average_score": avg_score,
            "created_at": s.created_at.isoformat(),
        })
    
    return history


@router.get("/{session_id}", response_model=SessionSummary)
async def get_session_detail(
    session_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(InterviewSession).where(InterviewSession.id == session_id)
    )
    interview_session = result.scalar_one_or_none()
    
    if not interview_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    answers_result = await session.execute(
        select(AnswerRecord).where(AnswerRecord.session_id == session_id)
    )
    answers = answers_result.scalars().all()
    
    scores = [a.overall_score for a in answers if a.overall_score]
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