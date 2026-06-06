import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    USE_TRANSFORMERS = True
    print("SentenceTransformers initialized successfully with 'all-MiniLM-L6-v2'.")
except Exception as e:
    USE_TRANSFORMERS = False
    print(f"SentenceTransformers failed to load: {e}. Falling back to TF-IDF Cosine Similarity.")

def calculate_semantic_similarity(resume_text, job_text):
    if not resume_text.strip() or not job_text.strip():
        return 0.0

    if USE_TRANSFORMERS:
        try:
            embeddings = model.encode([resume_text, job_text])
            sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            return float(sim)
        except Exception as e:
            print(f"Transformers embedding failed: {e}. Falling back to TF-IDF.")
            
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([resume_text, job_text])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(sim)
    except Exception as e:
        print(f"TF-IDF similarity failed: {e}")
        return 0.0

def calculate_jaccard_similarity(resume_skills, job_skills):
    if not job_skills:
        return 0.5
    resume_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])
    intersection = resume_set.intersection(job_set)
    union = resume_set.union(job_set)
    if not union:
        return 0.0
    return len(intersection) / len(job_set)

def analyze_ats(resume_text, parsed_data):
    issues = []
    score = 100
    
    words = len(resume_text.split())
    if words < 150:
        score -= 20
        issues.append("Resume is too short. Add more details about your experience, skills, and projects.")
    elif words > 2500:
        score -= 10
        issues.append("Resume is excessively long. Try to condense it to 1-2 pages.")
        
    if not parsed_data.get("email"):
        score -= 15
        issues.append("Missing contact email address. ATS filters require clear contact details.")
    if not parsed_data.get("phone"):
        score -= 15
        issues.append("Missing contact phone number. recruiters need a quick way to call you.")
        
    if not parsed_data.get("education") or len(parsed_data.get("education")) == 0:
        score -= 15
        issues.append("Missing Education section header or details. Ensure 'Education' is clearly visible.")
    if not parsed_data.get("experience") or len(parsed_data.get("experience")) == 0:
        score -= 10
        issues.append("Missing Experience or Internships section. Recruiters heavily filter by experience.")
    if not parsed_data.get("projects") or len(parsed_data.get("projects")) == 0:
        score -= 10
        issues.append("Missing Projects section. Adding personal or academic projects boosts student employability.")
        
    special_chars = len(re.findall(r'[★■●♦➔✔]| {3,}', resume_text))
    if special_chars > 10:
        score -= 10
        issues.append("Detected excessive icons or special bullet symbols (e.g. ★, ■). Use standard bullet points (- or •).")
        
    return max(0, score), issues

def calculate_employability_score(resume_skills, parsed_data, match_score):
    score = 40
    exp_count = len(parsed_data.get("experience", []))
    score += min(20, exp_count * 5)
    project_count = len(parsed_data.get("projects", []))
    score += min(15, project_count * 5)
    cert_count = len(parsed_data.get("certifications", []))
    score += min(10, cert_count * 5)
    skills_count = len(resume_skills)
    score += min(15, skills_count * 1)
    
    final_score = (score * 0.4) + (match_score * 0.6)
    return min(100, int(final_score))
