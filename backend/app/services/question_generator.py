from typing import List, Optional
import uuid

from app.services.ollama_client import OllamaClient
from app.services.prompt_templates import QUESTION_GENERATOR_SYSTEM_PROMPT
from app.schemas.question import Question, QuestionType


class QuestionGenerator:
    def __init__(self):
        self.client = OllamaClient()
    
    async def generate_questions(
        self,
        background_text: Optional[str] = None,
        job_description_text: Optional[str] = None,
        question_types: List[QuestionType] = None,
        count: int = 5
    ) -> List[Question]:
        if question_types is None:
            question_types = [QuestionType.BEHAVIORAL]
        
        prompt_parts = []
        
        if background_text:
            prompt_parts.append(f"Candidate Background:\n{background_text}")
        
        if job_description_text:
            prompt_parts.append(f"Target Job Description:\n{job_description_text}")
        
        types_str = ", ".join([qt.value for qt in question_types])
        prompt_parts.append(f"Question Types to Generate: {types_str}")
        prompt_parts.append(f"Number of Questions: {count}")
        
        prompt = "\n\n".join(prompt_parts)
        prompt += "\n\nGenerate interview questions that would help this candidate prepare."
        
        response = await self.client.generate_json(
            prompt=prompt,
            system_prompt=QUESTION_GENERATOR_SYSTEM_PROMPT
        )
        
        questions = []
        if isinstance(response, list):
            for q in response:
                questions.append(Question(
                    id=q.get("id", str(uuid.uuid4())),
                    text=q.get("text", ""),
                    type=QuestionType(q.get("type", "behavioral")),
                    category=q.get("category", "general"),
                    expected_star_components=q.get("expected_star_components")
                ))
        
        return questions