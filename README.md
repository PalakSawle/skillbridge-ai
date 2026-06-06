# SkillBridge AI 🌉

SkillBridge AI is a hackathon-ready, full-stack web application that uses Natural Language Processing (NLP) and machine learning (semantic embeddings) to parse student resumes, analyze job descriptions, perform automated skill-gap analysis, provide interactive learning roadmaps, calculate ATS compatibility scores, and generate simulated interview preparation prep.

---

## 🌟 Core Features
1. **Resume Parsing & NLP Extraction**: Extracts contact details, projects, education, and skills (technical and soft) from uploaded PDF or Word resumes using rule-based parsing.
2. **Semantic Job Matching**: Compares resumes and job descriptions in high-dimensional vector spaces using `Sentence-Transformers` (`all-MiniLM-L6-v2` or fallback TF-IDF + Cosine Similarity) to generate a combined job fit score.
3. **ATS Compatibility Audits**: Evaluates formatting, structures, character density, and keyword compliance, offering recommendations to increase recruiter callback rates.
4. **Interactive Learning Roadmaps**: Generates custom timelines with beginner/intermediate/advanced difficulty tags, learning steps, and links to free courses/videos for identified missing skills.
5. **AI Interview Prep**: Formulates technical, behavioral, and project-specific mock questions with recruiter expectations and student answer sandboxes.
6. **Placement Cell Analytics Dashboard**: Aggregates campus-wide metrics, listing total processed resumes, average scores, and top missing skills (e.g. Docker, AWS) to help administrators host targeted training.

---

## 🏗️ Tech Stack & Microservices
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios, Framer Motion
- **API Gateway Backend**: Node.js, Express.js, Mongoose ODM
- **AI Microservice**: Python, FastAPI, Uvicorn, PyPDF, Python-Docx, Scikit-Learn, Sentence-Transformers
- **Database**: MongoDB

---

## 📁 Directory Structure
```
skillbridge-ai/
├── docker-compose.yml        # Multi-container orchestration
├── README.md                 # Root documentation
├── dataset/                  # Sample resume and job profiles for tests
│   ├── sample_resume_john_doe.txt
│   └── sample_job_full_stack.txt
├── docs/                     # Guides and slides
│   ├── DEPLOYMENT.md         # Step-by-step setup guide
│   └── HACKATHON_DEMO.md     # PPT structure & talking points
├── backend/                  # Express Gateway API
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── config/               # Database config
│   ├── middleware/           # Auth guards
│   ├── routes/               # API Router endpoints
│   └── models/               # MongoDB Mongoose models
├── ai-service/               # Python FastAPI Microservice
│   ├── Dockerfile
│   ├── main.py
│   ├── parser.py             # Resume & Text NLP extractor
│   ├── match_engine.py       # Embeddings & similarity engine
│   ├── recommender.py        # Roadmap & Interview coaches
│   └── requirements.txt
└── frontend/                 # React UI
    ├── Dockerfile
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css         # Styling system
        ├── utils/            # Axios API wrappers
        └── components/       # Interface screens
            ├── Auth.jsx
            ├── Header.jsx
            ├── ResumeUpload.jsx
            ├── JobInput.jsx
            ├── Dashboard.jsx
            ├── RoadmapView.jsx
            ├── InterviewPrep.jsx
            ├── History.jsx
            └── AdminAnalytics.jsx
```

---

## ⚡ Quick Start (Docker)
Ensure Docker Desktop is running and run:
```bash
docker-compose up --build
```
- React Frontend: [http://localhost:3000](http://localhost:3000)
- Node Backend API: [http://localhost:5000](http://localhost:5000)
- FastAPI Service: [http://localhost:8000](http://localhost:8000)

*For local standalone commands, virtual environments, and REST API docs, please refer to [docs/DEPLOYMENT.md](file:///C:/Users/91903/.gemini/antigravity/scratch/skillbridge-ai/docs/DEPLOYMENT.md).*

---

## 🎤 Hackathon Demo & Slides
Pitch decks, target user personas, and a step-by-step 3-minute demo script for judging can be found in [docs/HACKATHON_DEMO.md](file:///C:/Users/91903/.gemini/antigravity/scratch/skillbridge-ai/docs/HACKATHON_DEMO.md).
