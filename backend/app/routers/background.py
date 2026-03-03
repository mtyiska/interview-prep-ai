from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
import json

from app.db.database import get_session
from app.models.background import Background, STARStory, Experience
from app.schemas.background import (
    BackgroundCreate, BackgroundUpdate, BackgroundResponse,
    STARStoryCreate, STARStoryResponse,
    ExperienceCreate, ExperienceResponse
)
from app.services.resume_parser import ResumeParser
from app.schemas.background import ResumeParseRequest, ResumeParseResponse

router = APIRouter()


@router.post("", response_model=BackgroundResponse)
async def create_background(
    data: BackgroundCreate,
    session: AsyncSession = Depends(get_session)
):
    background = Background(
        name=data.name,
        resume_text=data.resume_text,
        skills_json=json.dumps(data.skills)
    )
    session.add(background)
    await session.commit()
    await session.refresh(background)
    
    return BackgroundResponse(
        id=background.id,
        name=background.name,
        resume_text=background.resume_text,
        skills=background.skills,
        experiences=[],
        star_stories=[],
        created_at=background.created_at,
        updated_at=background.updated_at
    )


@router.get("/{background_id}", response_model=BackgroundResponse)
async def get_background(
    background_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Background).where(Background.id == background_id)
    )
    background = result.scalar_one_or_none()
    
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    
    # Fetch experiences
    exp_result = await session.execute(
        select(Experience).where(Experience.background_id == background_id)
    )
    experiences = exp_result.scalars().all()
    
    # Fetch STAR stories
    star_result = await session.execute(
        select(STARStory).where(STARStory.background_id == background_id)
    )
    star_stories = star_result.scalars().all()
    
    return BackgroundResponse(
        id=background.id,
        name=background.name,
        resume_text=background.resume_text,
        skills=background.skills,
        experiences=[
            ExperienceResponse(
                id=e.id,
                company=e.company,
                role=e.role,
                duration=e.duration,
                description=e.description,
                created_at=e.created_at
            ) for e in experiences
        ],
        star_stories=[
            STARStoryResponse(
                id=s.id,
                title=s.title,
                situation=s.situation,
                task=s.task,
                action=s.action,
                result=s.result,
                tags=s.tags,
                created_at=s.created_at
            ) for s in star_stories
        ],
        created_at=background.created_at,
        updated_at=background.updated_at
    )


@router.put("/{background_id}", response_model=BackgroundResponse)
async def update_background(
    background_id: str,
    data: BackgroundUpdate,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Background).where(Background.id == background_id)
    )
    background = result.scalar_one_or_none()
    
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    
    if data.name is not None:
        background.name = data.name
    if data.resume_text is not None:
        background.resume_text = data.resume_text
    if data.skills is not None:
        background.skills_json = json.dumps(data.skills)
    
    session.add(background)
    await session.commit()
    await session.refresh(background)
    
    return await get_background(background_id, session)


@router.post("/{background_id}/star-stories", response_model=STARStoryResponse)
async def add_star_story(
    background_id: str,
    data: STARStoryCreate,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Background).where(Background.id == background_id)
    )
    background = result.scalar_one_or_none()
    
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    
    story = STARStory(
        background_id=background_id,
        title=data.title,
        situation=data.situation,
        task=data.task,
        action=data.action,
        result=data.result,
        tags_json=json.dumps(data.tags)
    )
    session.add(story)
    await session.commit()
    await session.refresh(story)
    
    return STARStoryResponse(
        id=story.id,
        title=story.title,
        situation=story.situation,
        task=story.task,
        action=story.action,
        result=story.result,
        tags=story.tags,
        created_at=story.created_at
    )


@router.post("/{background_id}/experiences", response_model=ExperienceResponse)
async def add_experience(
    background_id: str,
    data: ExperienceCreate,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Background).where(Background.id == background_id)
    )
    background = result.scalar_one_or_none()
    
    if not background:
        raise HTTPException(status_code=404, detail="Background not found")
    
    experience = Experience(
        background_id=background_id,
        company=data.company,
        role=data.role,
        duration=data.duration,
        description=data.description
    )
    session.add(experience)
    await session.commit()
    await session.refresh(experience)
    
    return ExperienceResponse(
        id=experience.id,
        company=experience.company,
        role=experience.role,
        duration=experience.duration,
        description=experience.description,
        created_at=experience.created_at
    )


@router.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume(data: ResumeParseRequest):
    """
    Parse a resume and extract profile information including generated STAR stories.
    Returns extracted data for user review before saving.
    """
    parser = ResumeParser()
    result = await parser.parse_resume(data.resume_text)
    
    return ResumeParseResponse(
        name=result.name,
        skills=result.skills,
        experiences=[
            {
                "company": exp.company,
                "role": exp.role,
                "duration": exp.duration,
                "description": exp.description
            } for exp in result.experiences
        ],
        star_stories=[
            {
                "title": story.title,
                "situation": story.situation,
                "task": story.task,
                "action": story.action,
                "result": story.result,
                "tags": story.tags
            } for story in result.star_stories
        ]
    )