from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ExtractedRequirements(BaseModel):
    must_have_skills: List[str]
    nice_to_have_skills: List[str]
    responsibilities: List[str]
    suggested_question_topics: List[str]


class JobDescriptionCreate(BaseModel):
    title: str
    company: Optional[str] = None
    raw_text: str


class JobDescriptionResponse(BaseModel):
    id: str
    title: str
    company: Optional[str]
    raw_text: str
    extracted_requirements: ExtractedRequirements
    created_at: datetime