from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
import uuid
import json


class SessionMode(str, Enum):
    FLASHCARD = "flashcard"
    MOCK = "mock"


class SessionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"


class InterviewSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    mode: str
    background_id: str = Field(foreign_key="background.id")
    job_description_id: Optional[str] = Field(default=None, foreign_key="jobdescription.id")
    questions_json: str = "[]"
    current_question_index: int = 0
    status: str = SessionStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def questions(self):
        return json.loads(self.questions_json)
    
    @questions.setter
    def questions(self, value):
        self.questions_json = json.dumps(value)


class AnswerRecord(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: str = Field(foreign_key="interviewsession.id")
    question_id: str
    question_text: str
    answer_text: str
    overall_score: Optional[int] = None
    feedback_json: Optional[str] = None
    # skipped: bool = False  # NEW FIELD
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def feedback(self):
        if self.feedback_json:
            return json.loads(self.feedback_json)
        return None