# 🎯 Interview Prep AI

An AI-powered interview preparation tool that helps you practice behavioral interviews using the STAR method (Situation, Task, Action, Result).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-green.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)

## Demo

[![Watch the demo](https://img.youtube.com/vi/WtHovefyIVU/maxresdefault.jpg)](https://www.youtube.com/shorts/WtHovefyIVU)

## ✨ Features

- **🤖 AI-Powered Resume Parsing** — Paste your resume and automatically extract skills, experiences, and generate STAR stories
- **📝 STAR Story Management** — Create, edit, and organize your behavioral interview stories
- **🎯 Job Description Analysis** — Parse job postings to get role-specific interview questions
- **💬 Flashcard Practice** — Quick Q&A practice with instant AI feedback
- **🎤 Mock Interviews** — Full voice-enabled interview simulation with speech-to-text and text-to-speech
- **📊 Progress Tracking** — Review past sessions and track improvement over time
- **🌙 Dark Mode** — Easy on the eyes for late-night prep sessions

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI, SQLModel, SQLite |
| **AI** | Ollama (Llama 3.1 8B / Phi-3) |
| **Voice** | Web Speech API (browser-native) |
| **Deployment** | Docker Compose |

## 📁 Project Structure

```
interview-prep-ai/
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app entry point
│   │   ├── config.py                 # Environment configuration
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── background.py         # Profile & STAR story endpoints
│   │   │   ├── job_descriptions.py   # Job parsing endpoints
│   │   │   ├── questions.py          # Question generation endpoints
│   │   │   ├── interview.py          # Practice session endpoints
│   │   │   └── history.py            # Session history endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ollama_client.py      # Ollama API wrapper
│   │   │   ├── resume_parser.py      # AI resume extraction
│   │   │   ├── question_generator.py # AI question generation
│   │   │   ├── star_evaluator.py     # AI answer evaluation
│   │   │   ├── job_parser.py         # Job description analysis
│   │   │   └── prompt_templates.py   # LLM prompt templates
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── background.py         # User profile models
│   │   │   ├── job_description.py    # Job posting models
│   │   │   └── session.py            # Interview session models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── background.py         # Profile request/response schemas
│   │   │   ├── job_description.py    # Job request/response schemas
│   │   │   ├── question.py           # Question schemas
│   │   │   ├── interview.py          # Session & feedback schemas
│   │   │   └── common.py             # Shared schemas
│   │   └── db/
│   │       ├── __init__.py
│   │       └── database.py           # SQLite async connection
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                         # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout with providers
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── setup/
│   │   │   │   └── page.tsx          # Profile setup page
│   │   │   ├── jobs/
│   │   │   │   └── page.tsx          # Job targets page
│   │   │   ├── practice/
│   │   │   │   ├── page.tsx          # Practice mode selection
│   │   │   │   ├── flashcard/
│   │   │   │   │   └── page.tsx      # Flashcard practice
│   │   │   │   └── interview/
│   │   │   │       └── page.tsx      # Mock interview
│   │   │   └── history/
│   │   │       └── page.tsx          # Session history
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── layout/
│   │   │   │   └── Header.tsx        # Navigation header
│   │   │   ├── background/
│   │   │   │   ├── STARStoryForm.tsx # STAR story input form
│   │   │   │   └── STARStoryCard.tsx # STAR story display
│   │   │   ├── practice/
│   │   │   │   ├── QuestionCard.tsx  # Question display
│   │   │   │   └── FeedbackPanel.tsx # AI feedback display
│   │   │   ├── voice/
│   │   │   │   ├── VoiceButton.tsx   # Mic toggle button
│   │   │   │   └── SpeakingIndicator.tsx
│   │   │   └── providers/
│   │   │       └── ThemeProvider.tsx # Dark mode provider
│   │   ├── services/
│   │   │   ├── api.ts                # Axios instance
│   │   │   ├── backgroundService.ts  # Profile API calls
│   │   │   ├── jobService.ts         # Job API calls
│   │   │   ├── interviewService.ts   # Session API calls
│   │   │   ├── questionService.ts    # Question API calls
│   │   │   └── historyService.ts     # History API calls
│   │   ├── hooks/
│   │   │   ├── useVoiceInput.ts      # Speech-to-text hook
│   │   │   └── useVoiceOutput.ts     # Text-to-speech hook
│   │   ├── store/
│   │   │   └── appStore.ts           # Zustand global state
│   │   ├── types/
│   │   │   ├── background.ts         # Profile types
│   │   │   ├── job.ts                # Job types
│   │   │   ├── question.ts           # Question types
│   │   │   ├── interview.ts          # Session types
│   │   │   └── global.d.ts           # Web Speech API types
│   │   └── lib/
│   │       └── utils.ts              # Utility functions
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── docker-compose.yml                # Container orchestration
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- OR for local development:
  - Python 3.11+
  - Node.js 18+
  - [Ollama](https://ollama.com/)

### Option 1: Docker (Recommended)

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/interview-prep-ai.git
cd interview-prep-ai
```

**2. Configure Docker resources**

Open Docker Desktop → Settings → Resources → Advanced:
- Set Memory to **10-12 GB** (required for AI model)
- Click "Apply & Restart"

**3. Start the services**

```bash
docker-compose up --build
```

**4. Pull the AI model (first time only)**

In a new terminal:

```bash
# For best quality (requires 8GB+ RAM)
docker exec -it interview-prep-ai-ollama-1 ollama pull llama3.1

# OR for faster responses (works with 4GB RAM)
docker exec -it interview-prep-ai-ollama-1 ollama pull phi3
```

**5. Access the app**

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8000
- 📚 **API Docs:** http://localhost:8000/docs

---

### Option 2: Local Development

**1. Clone and setup backend**

```bash
git clone https://github.com/yourusername/interview-prep-ai.git
cd interview-prep-ai

# Create Python environment
conda create --name interview-prep-ai python=3.11 -y
conda activate interview-prep-ai

# Install dependencies
cd backend
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

**2. Setup frontend**

```bash
cd ../frontend
yarn install
```

**3. Install and start Ollama**

```bash
# macOS
brew install ollama

# Start Ollama service
ollama serve

# Pull model (in another terminal)
ollama pull llama3.1
```

**4. Start the services**

Terminal 1 - Backend:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
yarn dev
```

**5. Access the app**

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8000

## 📖 How to Use

### Step 1: Set Up Your Profile

1. Go to **My Profile**
2. Paste your resume into the text area
3. Click **"✨ Auto-fill from Resume"**
4. Wait 1-2 minutes while AI extracts your information
5. Review the generated STAR stories
6. Remove any you don't want, add more manually if needed
7. Click **Save Profile**

### Step 2: Add Job Targets (Optional)

1. Go to **Job Targets**
2. Click **"Add Job"**
3. Enter the job title and company
4. Paste the full job description
5. Click **"Add & Analyze"**
6. AI extracts required skills and suggested interview topics

### Step 3: Practice

**Flashcard Mode** (Quick Practice)
1. Go to **Practice → Flashcard Practice**
2. Read the question
3. Type your answer OR click the 🎤 microphone to speak
4. Submit and receive AI feedback
5. Review your STAR breakdown scores
6. Continue to next question

**Mock Interview Mode** (Full Simulation)
1. Go to **Practice → Mock Interview**
2. Click **Start Interview**
3. AI speaks the question aloud
4. Click 🎤 to record your spoken answer
5. Click **Stop & Submit**
6. AI speaks feedback aloud
7. Complete all questions for a full summary

### Step 4: Review Progress

1. Go to **History**
2. See all past sessions with scores
3. Click any session to review details
4. Track improvement over time

## ⚙️ Configuration

### Environment Variables

**Backend (`backend/.env`)**

```env
OLLAMA_BASE_URL=http://localhost:11434   # Use http://ollama:11434 for Docker
OLLAMA_MODEL=llama3.1                     # Or phi3 for faster/lighter model
DATABASE_URL=sqlite+aiosqlite:///./interview_prep.db
```

**Frontend (`frontend/.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### AI Model Options

| Model | RAM Required | Speed | Quality |
|-------|--------------|-------|---------|
| `llama3.1` | 8-16 GB | Slower | Best |
| `phi3` | 4-6 GB | Faster | Good |
| `mistral` | 8 GB | Medium | Great |

To switch models:

```bash
# Pull new model
docker exec -it interview-prep-ai-ollama-1 ollama pull phi3

# Update backend/.env
OLLAMA_MODEL=phi3

# Restart backend
docker-compose restart backend
```

## 🔧 Troubleshooting

### "Failed to parse resume" or Timeout Errors

The AI model takes time to process, especially on first run.

**Solutions:**
- Wait longer (can take 2-3 minutes on CPU)
- Switch to a faster model (`phi3`)
- Increase Docker memory allocation

### CORS Errors

Usually a side effect of backend errors. Check backend logs:

```bash
docker-compose logs -f backend
```

### "Model not found" Error

Pull the model first:

```bash
docker exec -it interview-prep-ai-ollama-1 ollama pull llama3.1
```

### Voice Not Working

- Ensure you're using Chrome, Edge, or Safari
- Allow microphone permissions when prompted
- Check that your mic is not muted

### Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

## 🛠️ Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
yarn test
```

### Adding New Features

1. **Backend:** Add routes in `backend/app/routers/`, services in `backend/app/services/`
2. **Frontend:** Add pages in `frontend/src/app/`, components in `frontend/src/components/`

### Database Migrations

Using SQLModel with SQLite — tables auto-create on startup. For schema changes, delete the `.db` file and restart.

## 📄 API Documentation

Once running, visit http://localhost:8000/docs for interactive Swagger documentation.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/background` | Create user profile |
| POST | `/api/background/parse-resume` | AI-parse resume |
| POST | `/api/job-descriptions` | Add & analyze job posting |
| POST | `/api/interview/start` | Start practice session |
| POST | `/api/interview/{id}/answer` | Submit answer for evaluation |
| GET | `/api/history` | Get past sessions |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.com/) for local LLM inference
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Next.js](https://nextjs.org/) for the frontend framework

---

**Built with ❤️ for job seekers everywhere. Good luck with your interviews!**

MIT License
---
