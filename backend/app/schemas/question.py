from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class QuestionType(str, Enum):
    BEHAVIORAL = "behavioral"
    TECHNICAL = "technical"
    SITUATIONAL = "situational"
    COMPETENCY = "competency"


class Question(BaseModel):
    id: str
    text: str
    type: QuestionType
    category: str
    expected_star_components: Optional[List[str]] = None


class QuestionGenerateRequest(BaseModel):
    background_id: Optional[str] = None
    job_description_id: Optional[str] = None
    question_types: List[QuestionType] = [QuestionType.BEHAVIORAL]
    count: int = 5


class QuestionGenerateResponse(BaseModel):
    questions: List[Question]