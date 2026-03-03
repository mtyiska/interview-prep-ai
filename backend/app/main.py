from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import background, job_descriptions, questions, interview, history
from app.db.database import create_db_and_tables

app = FastAPI(
    title="Interview Prep AI",
    description="AI-powered interview preparation with STAR method coaching",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(background.router, prefix="/api/background", tags=["Background"])
app.include_router(job_descriptions.router, prefix="/api/job-descriptions", tags=["Job Descriptions"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])
app.include_router(history.router, prefix="/api/history", tags=["History"])


@app.on_event("startup")
async def on_startup():
    await create_db_and_tables()


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/health/ollama")
async def ollama_health_check():
    from app.services.ollama_client import OllamaClient
    client = OllamaClient()
    is_healthy = await client.health_check()
    return {"status": "healthy" if is_healthy else "unhealthy"}