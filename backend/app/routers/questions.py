from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.db.database import get_session
from app.models.background import Background
from app.models.job_description import JobDescription
from app.schemas.question import QuestionGenerateRequest, QuestionGenerateResponse
from app.services.question_generator import QuestionGenerator

router = APIRouter()


@router.post("/generate", response_model=QuestionGenerateResponse)
async def generate_questions(
    data: QuestionGenerateRequest,
    session: AsyncSession = Depends(get_session)
):
    background_text = None
    job_description_text = None
    
    if data.background_id:
        result = await session.execute(
            select(Background).where(Background.id == data.background_id)
        )
        background = result.scalar_one_or_none()
        if not background:
            raise HTTPException(status_code=404, detail="Background not found")
        
        # Compile background text
        parts = []
        if background.resume_text:
            parts.append(f"Resume:\n{background.resume_text}")
        if background.skills:
            parts.append(f"Skills: {', '.join(background.skills)}")
        background_text = "\n\n".join(parts)
    
    if data.job_description_id:
        result = await session.execute(
            select(JobDescription).where(JobDescription.id == data.job_description_id)
        )
        job = result.scalar_one_or_none()
        if not job:
            raise HTTPException(status_code=404, detail="Job description not found")
        
        job_description_text = job.raw_text
    
    generator = QuestionGenerator()
    questions = await generator.generate_questions(
        background_text=background_text,
        job_description_text=job_description_text,
        question_types=data.question_types,
        count=data.count
    )
    
    return QuestionGenerateResponse(questions=questions)


@router.get("/bank")
async def get_question_bank():
    """Returns a predefined set of common interview questions by category"""
    return {
        "behavioral": [
            {"id": "b1", "text": "Tell me about a time you faced a difficult challenge at work.", "category": "problem-solving"},
            {"id": "b2", "text": "Describe a situation where you had to work with a difficult team member.", "category": "teamwork"},
            {"id": "b3", "text": "Give an example of when you showed leadership.", "category": "leadership"},
            {"id": "b4", "text": "Tell me about a time you failed and what you learned.", "category": "growth"},
            {"id": "b5", "text": "Describe a time you had to meet a tight deadline.", "category": "time-management"},
        ],
        "situational": [
            {"id": "s1", "text": "What would you do if you disagreed with your manager's decision?", "category": "conflict"},
            {"id": "s2", "text": "How would you handle multiple urgent tasks with the same deadline?", "category": "prioritization"},
            {"id": "s3", "text": "What would you do if a team member wasn't pulling their weight?", "category": "teamwork"},
        ],
        "competency": [
            {"id": "c1", "text": "How do you stay organized and manage your workload?", "category": "organization"},
            {"id": "c2", "text": "How do you approach learning new skills?", "category": "learning"},
            {"id": "c3", "text": "How do you handle feedback and criticism?", "category": "growth"},
        ]
    }