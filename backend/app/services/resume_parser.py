from typing import List, Optional
from pydantic import BaseModel

from app.services.ollama_client import OllamaClient
from app.services.prompt_templates import RESUME_PARSER_SYSTEM_PROMPT


class ParsedExperience(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class ParsedSTARStory(BaseModel):
    title: str
    situation: str
    task: str
    action: str
    result: str
    tags: List[str] = []


class ParsedResume(BaseModel):
    name: str
    skills: List[str] = []
    experiences: List[ParsedExperience] = []
    star_stories: List[ParsedSTARStory] = []


class ResumeParser:
    def __init__(self):
        self.client = OllamaClient()

    async def parse_resume(self, resume_text: str) -> ParsedResume:
        prompt = f"""Please analyze this resume and extract the structured information:

{resume_text}

Remember to:
1. Extract the person's name
2. List all technical and soft skills mentioned
3. Extract work experiences with company, role, duration, and description
4. Generate 3-5 STAR stories based on achievements mentioned

Return only valid JSON."""

        response = await self.client.generate_json(
            prompt=prompt,
            system_prompt=RESUME_PARSER_SYSTEM_PROMPT,
            temperature=0.3
        )

        # Handle parsing errors
        if "error" in response:
            return ParsedResume(
                name="",
                skills=[],
                experiences=[],
                star_stories=[]
            )

        # Parse experiences
        experiences = []
        for exp in response.get("experiences", []):
            experiences.append(ParsedExperience(
                company=exp.get("company", ""),
                role=exp.get("role", ""),
                duration=exp.get("duration", ""),
                description=exp.get("description", "")
            ))

        # Parse STAR stories
        star_stories = []
        for story in response.get("star_stories", []):
            star_stories.append(ParsedSTARStory(
                title=story.get("title", ""),
                situation=story.get("situation", ""),
                task=story.get("task", ""),
                action=story.get("action", ""),
                result=story.get("result", ""),
                tags=story.get("tags", [])
            ))

        return ParsedResume(
            name=response.get("name", ""),
            skills=response.get("skills", []),
            experiences=experiences,
            star_stories=star_stories
        )