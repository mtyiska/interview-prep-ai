from app.services.ollama_client import OllamaClient
from app.services.prompt_templates import JOB_PARSER_SYSTEM_PROMPT
from app.schemas.job_description import ExtractedRequirements


class JobParser:
    def __init__(self):
        self.client = OllamaClient()
    
    async def parse_job_description(self, raw_text: str) -> ExtractedRequirements:
        prompt = f"""Please analyze this job description:

{raw_text}

Extract the key requirements, skills, and interview topics."""
        
        response = await self.client.generate_json(
            prompt=prompt,
            system_prompt=JOB_PARSER_SYSTEM_PROMPT
        )
        
        return ExtractedRequirements(
            must_have_skills=response.get("must_have_skills", []),
            nice_to_have_skills=response.get("nice_to_have_skills", []),
            responsibilities=response.get("responsibilities", []),
            suggested_question_topics=response.get("suggested_question_topics", [])
        )