from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
import json


class JobDescription(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str
    company: Optional[str] = None
    raw_text: str
    must_have_skills_json: str = "[]"
    nice_to_have_skills_json: str = "[]"
    responsibilities_json: str = "[]"
    suggested_topics_json: str = "[]"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def must_have_skills(self):
        return json.loads(self.must_have_skills_json)
    
    @property
    def nice_to_have_skills(self):
        return json.loads(self.nice_to_have_skills_json)
    
    @property
    def responsibilities(self):
        return json.loads(self.responsibilities_json)
    
    @property
    def suggested_topics(self):
        return json.loads(self.suggested_topics_json)