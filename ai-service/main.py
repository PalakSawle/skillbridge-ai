from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

import parser
import match_engine
import recommender

app = FastAPI(
    title="SkillBridge AI Microservice",
    description="NLP & Machine Learning service for Resume-to-Job Fit analysis.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobInput(BaseModel):
    text: str

class FitAnalysisInput(BaseModel):
    resumeText: str
    resumeSkills: List[str]
    resumeData: Dict[str, Any]
    jobText: str
    jobSkills: List[str]

@app.get("/")
def home():
    return {
        "status": "online",
        "service": "SkillBridge AI Microservice",
        "sentence_transformers_active": match_engine.USE_TRANSFORMERS
    }

@app.post("/parse-resume")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    filename = file.filename or "resume.pdf"
    if not (filename.endswith('.pdf') or filename.endswith('.docx') or filename.endswith('.doc') or filename.endswith('.txt')):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
        
    try:
        file_bytes = await file.read()
        parsed_data = parser.parse_resume(file_bytes, filename)
        return parsed_data
    except Exception as e:
        print(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Internal resume parsing error: {str(e)}")

@app.post("/extract-skills")
def extract_skills_endpoint(job: JobInput):
    if not job.text.strip():
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")
    try:
        tech_skills, soft_skills = parser.extract_skills_from_text(job.text)
        return {
            "technicalSkills": tech_skills,
            "softSkills": soft_skills
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-fit")
def analyze_fit_endpoint(data: FitAnalysisInput):
    try:
        semantic_sim = match_engine.calculate_semantic_similarity(data.resumeText, data.jobText)
        skill_sim = match_engine.calculate_jaccard_similarity(data.resumeSkills, data.jobSkills)
        
        job_match_score = int((semantic_sim * 0.6 + skill_sim * 0.4) * 100)
        job_match_score = min(98, max(12, job_match_score))
        
        resume_skills_lower = [s.lower() for s in data.resumeSkills]
        missing_skills = [
            skill for skill in data.jobSkills
            if skill.lower() not in resume_skills_lower
        ]
        
        found_skills = [
            skill for skill in data.jobSkills
            if skill.lower() in resume_skills_lower
        ]
        
        ats_score, ats_issues = match_engine.analyze_ats(data.resumeText, data.resumeData)
        employability_score = match_engine.calculate_employability_score(data.resumeSkills, data.resumeData, job_match_score)
        
        strengths = []
        weaknesses = []
        
        if len(found_skills) > 4:
            strengths.append(f"Strong match in core skills: {', '.join(found_skills[:4])}.")
        elif len(found_skills) > 0:
            strengths.append(f"Demonstrated proficiency in {', '.join(found_skills[:3])}.")
            
        if len(data.resumeData.get("projects", [])) >= 2:
            strengths.append("Excellent project portfolio illustrating practical application of skills.")
        if len(data.resumeData.get("experience", [])) >= 1:
            strengths.append("Demonstrated professional experience in internship or job formats.")
            
        if not strengths:
            strengths.append("Found base education credentials supporting resume foundations.")
            
        if len(missing_skills) > 3:
            weaknesses.append(f"Significant skill gaps detected in key requirements: {', '.join(missing_skills[:3])}.")
        elif len(missing_skills) > 0:
            weaknesses.append(f"Missing a few secondary skillsets: {', '.join(missing_skills[:2])}.")
            
        if len(data.resumeData.get("experience", [])) == 0:
            weaknesses.append("Lack of professional work or internship history. Focus on building more projects.")
        if len(data.resumeData.get("projects", [])) == 0:
            weaknesses.append("No project portfolio listed. Hackathon entries and personal projects are critical.")
            
        roadmap = recommender.generate_roadmap(missing_skills)
        interview_questions = recommender.generate_interview_prep(found_skills, missing_skills, data.resumeData)
        
        return {
            "jobMatchScore": job_match_score,
            "atsScore": ats_score,
            "employabilityScore": employability_score,
            "analysis": {
                "skillsFound": found_skills,
                "missingSkills": missing_skills,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "atsFormattingIssues": ats_issues
            },
            "roadmap": roadmap,
            "interviewPrep": interview_questions
        }
    except Exception as e:
        print(f"Error in fit analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Fit analysis server error: {str(e)}")
