from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import datetime


class SessionMode(str, Enum):
    FLASHCARD = "flashcard"
    MOCK = "mock"


class SessionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"


class StartSessionRequest(BaseModel):
    mode: SessionMode
    background_id: str
    job_description_id: Optional[str] = None
    question_count: int = 5


class AnswerSubmission(BaseModel):
    answer_text: str
    audio_duration_seconds: Optional[float] = None


class STARBreakdown(BaseModel):
    situation: int
    task: int
    action: int
    result: int


class FeedbackResponse(BaseModel):
    overall_score: int
    star_breakdown: STARBreakdown
    strengths: List[str]
    improvements: List[str]
    suggested_revision: Optional[str] = None
    follow_up_question: Optional[str] = None


class AnswerRecordResponse(BaseModel):
    id: str
    question_id: str
    question_text: str
    answer_text: str
    overall_score: Optional[int]
    feedback: Optional[FeedbackResponse]
    created_at: datetime


class SessionResponse(BaseModel):
    id: str
    mode: SessionMode
    background_id: str
    job_description_id: Optional[str]
    questions: List[dict]
    current_question_index: int
    status: SessionStatus
    created_at: datetime


class SessionSummary(BaseModel):
    session_id: str
    total_questions: int
    questions_answered: int
    average_score: Optional[float]
    answers: List[AnswerRecordResponse]