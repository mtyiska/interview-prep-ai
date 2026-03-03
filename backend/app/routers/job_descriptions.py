from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
import json

from app.db.database import get_session
from app.models.job_description import JobDescription
from app.schemas.job_description import (
    JobDescriptionCreate, JobDescriptionResponse, ExtractedRequirements
)
from app.services.job_parser import JobParser

router = APIRouter()


@router.post("", response_model=JobDescriptionResponse)
async def create_job_description(
    data: JobDescriptionCreate,
    session: AsyncSession = Depends(get_session)
):
    # Parse the job description
    parser = JobParser()
    requirements = await parser.parse_job_description(data.raw_text)
    
    job = JobDescription(
        title=data.title,
        company=data.company,
        raw_text=data.raw_text,
        must_have_skills_json=json.dumps(requirements.must_have_skills),
        nice_to_have_skills_json=json.dumps(requirements.nice_to_have_skills),
        responsibilities_json=json.dumps(requirements.responsibilities),
        suggested_topics_json=json.dumps(requirements.suggested_question_topics)
    )
    session.add(job)
    await session.commit()
    await session.refresh(job)
    
    return JobDescriptionResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        raw_text=job.raw_text,
        extracted_requirements=ExtractedRequirements(
            must_have_skills=job.must_have_skills,
            nice_to_have_skills=job.nice_to_have_skills,
            responsibilities=job.responsibilities,
            suggested_question_topics=job.suggested_topics
        ),
        created_at=job.created_at
    )


@router.get("/{job_id}", response_model=JobDescriptionResponse)
async def get_job_description(
    job_id: str,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(JobDescription).where(JobDescription.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    return JobDescriptionResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        raw_text=job.raw_text,
        extracted_requirements=ExtractedRequirements(
            must_have_skills=job.must_have_skills,
            nice_to_have_skills=job.nice_to_have_skills,
            responsibilities=job.responsibilities,
            suggested_question_topics=job.suggested_topics
        ),
        created_at=job.created_at
    )


@router.get("", response_model=List[JobDescriptionResponse])
async def list_job_descriptions(
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(select(JobDescription))
    jobs = result.scalars().all()
    
    return [
        JobDescriptionResponse(
            id=job.id,
            title=job.title,
            company=job.company,
            raw_text=job.raw_text,
            extracted_requirements=ExtractedRequirements(
                must_have_skills=job.must_have_skills,
                nice_to_have_skills=job.nice_to_have_skills,
                responsibilities=job.responsibilities,
                suggested_question_topics=job.suggested_topics
            ),
            created_at=job.created_at
        ) for job in jobs
    ]