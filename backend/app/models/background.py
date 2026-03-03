from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid
import json


class Experience(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    background_id: str = Field(foreign_key="background.id")
    company: str
    role: str
    duration: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class STARStory(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    background_id: str = Field(foreign_key="background.id")
    title: str
    situation: str
    task: str
    action: str
    result: str
    tags_json: str = "[]"  # Store as JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def tags(self) -> List[str]:
        return json.loads(self.tags_json)
    
    @tags.setter
    def tags(self, value: List[str]):
        self.tags_json = json.dumps(value)


class Background(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    resume_text: Optional[str] = None
    skills_json: str = "[]"  # Store as JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def skills(self) -> List[str]:
        return json.loads(self.skills_json)
    
    @skills.setter
    def skills(self, value: List[str]):
        self.skills_json = json.dumps(value)