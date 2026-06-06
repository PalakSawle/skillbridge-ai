# SkillBridge AI - Deployment Guide

This document details the configuration and deployment instructions for running SkillBridge AI in Docker containers or as standalone local services.

---

## Prerequisites
Ensure the following tools are installed on your machine:
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (v5.0 or higher) or a MongoDB Atlas account
- **Docker** & **Docker Compose** (for multi-container deployment)

---

## Option A: Docker Deployment (Recommended)
This is the fastest way to orchestrate all containers (MongoDB, AI service, Node backend, React frontend) with a single command.

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd skillbridge-ai
   ```

2. **Launch Services**:
   Navigate to the root directory containing `docker-compose.yml` and run:
   ```bash
   docker-compose up --build
   ```

3. **Verify running containers**:
   - React Frontend: [http://localhost:3000](http://localhost:3000)
   - Express Backend API: [http://localhost:5000](http://localhost:5000)
   - FastAPI AI Service: [http://localhost:8000](http://localhost:8000)
   - MongoDB Service: `localhost:27017`

---

## Option B: Standalone Local Deployment
If you prefer running services outside Docker for faster debugging or development:

### 1. MongoDB Database
Start a local MongoDB service on port `27017` or obtain a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. FastAPI AI Service
1. Open a new terminal and navigate to the AI service:
   ```bash
   cd ai-service
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Uvicorn server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 3. Node.js Express Backend
1. Open a new terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Create a `.env` file matching:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/skillbridge
   JWT_SECRET=skillbridge_jwt_secret_key_2026
   AI_SERVICE_URL=http://localhost:8000
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server (runs with nodemon):
   ```bash
   npm run dev
   ```

### 4. React Frontend Web App
1. Open a new terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## REST API Summary

### Authentication (`/api/auth`)
- `POST /register`: Registers a student or admin account.
- `POST /login`: Log in and return JWT session token.
- `GET /me`: Return active user session.

### Resumes (`/api/resumes`)
- `POST /upload`: Uploads PDF/Word resume using Multer, triggers NLP parsing, and saves raw text + key elements.
- `GET /`: Retrieve all resumes uploaded by the logged-in user.
- `DELETE /:id`: Deletes resume index.

### Jobs (`/api/jobs`)
- `POST /`: Creates a job description record and triggers FastAPI keyword skill extraction.
- `GET /`: Lists all job postings input by the user.

### Reports (`/api/reports`)
- `POST /generate`: Analyzes matching vectors, scores ATS benchmarks, and compiles roadmaps/questions.
- `GET /`: Returns historical reports.
- `GET /:id`: Retrieves a single report.

### Admin Analytics (`/api/admin/analytics`)
- `GET /analytics`: Aggregates placement cell metrics, common campus skill gaps, and job target lists.
