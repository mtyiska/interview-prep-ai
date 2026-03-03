from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ExperienceCreate(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class ExperienceResponse(ExperienceCreate):
    id: str
    created_at: datetime


class STARStoryCreate(BaseModel):
    title: str
    situation: str
    task: str
    action: str
    result: str
    tags: List[str] = []


class STARStoryResponse(BaseModel):
    id: str
    title: str
    situation: str
    task: str
    action: str
    result: str
    tags: List[str]
    created_at: datetime


class BackgroundCreate(BaseModel):
    name: str
    resume_text: Optional[str] = None
    skills: List[str] = []


class BackgroundUpdate(BaseModel):
    name: Optional[str] = None
    resume_text: Optional[str] = None
    skills: Optional[List[str]] = None


class BackgroundResponse(BaseModel):
    id: str
    name: str
    resume_text: Optional[str]
    skills: List[str]
    experiences: List[ExperienceResponse] = []
    star_stories: List[STARStoryResponse] = []
    created_at: datetime
    updated_at: datetime


# Resume parsing schemas
class ParsedExperienceResponse(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class ParsedSTARStoryResponse(BaseModel):
    title: str
    situation: str
    task: str
    action: str
    result: str
    tags: List[str] = []


class ResumeParseRequest(BaseModel):
    resume_text: str


class ResumeParseResponse(BaseModel):
    name: str
    skills: List[str]
    experiences: List[ParsedExperienceResponse]
    star_stories: List[ParsedSTARStoryResponse]