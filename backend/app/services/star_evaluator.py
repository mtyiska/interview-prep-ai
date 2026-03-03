from app.services.ollama_client import OllamaClient
from app.services.prompt_templates import STAR_EVALUATOR_SYSTEM_PROMPT
from app.schemas.interview import FeedbackResponse, STARBreakdown


class STAREvaluator:
    def __init__(self):
        self.client = OllamaClient()
    
    async def evaluate_answer(
        self,
        question: str,
        answer: str
    ) -> FeedbackResponse:
        prompt = f"""Question Asked: {question}

Candidate's Response: {answer}

Please evaluate this response using the STAR method criteria."""
        
        response = await self.client.generate_json(
            prompt=prompt,
            system_prompt=STAR_EVALUATOR_SYSTEM_PROMPT
        )
        
        # Handle parsing errors
        if "error" in response:
            return FeedbackResponse(
                overall_score=5,
                star_breakdown=STARBreakdown(situation=5, task=5, action=5, result=5),
                strengths=["Unable to fully evaluate response"],
                improvements=["Try providing more specific details"],
                suggested_revision=None,
                follow_up_question=None
            )
        
        star_data = response.get("star_breakdown", {})
        
        return FeedbackResponse(
            overall_score=response.get("overall_score", 5),
            star_breakdown=STARBreakdown(
                situation=star_data.get("situation", 5),
                task=star_data.get("task", 5),
                action=star_data.get("action", 5),
                result=star_data.get("result", 5)
            ),
            strengths=response.get("strengths", []),
            improvements=response.get("improvements", []),
            suggested_revision=response.get("suggested_revision"),
            follow_up_question=response.get("follow_up_question")
        )