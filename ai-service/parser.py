import re
import io
from pypdf import PdfReader
from docx import Document

SKILL_KEYWORDS = {
    "technical": [
        "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "php", "go", "golang", "rust", "swift", "kotlin",
        "react", "angular", "vue", "next.js", "svelte", "express", "node.js", "node", "django", "flask", "fastapi", "spring boot", "laravel",
        "mongodb", "postgresql", "mysql", "sqlite", "redis", "cassandra", "dynamodb", "firebase", "oracle", "sql", "nosql",
        "docker", "kubernetes", "aws", "azure", "gcp", "google cloud", "terraform", "ansible", "jenkins", "git", "github", "gitlab", "ci/cd",
        "machine learning", "deep learning", "nlp", "natural language processing", "computer vision", "tensorflow", "pytorch",
        "keras", "scikit-learn", "sklearn", "pandas", "numpy", "matplotlib", "seaborn", "data analysis", "tableau", "power bi",
        "html", "html5", "css", "css3", "tailwind", "bootstrap", "sass", "graphql", "rest api", "microservices", "agile", "scrum"
    ],
    "soft": [
        "communication", "teamwork", "leadership", "problem solving", "collaboration", "adaptability", "management",
        "time management", "critical thinking", "creativity", "interpersonal", "conflict resolution", "negotiation",
        "public speaking", "active listening", "decision making", "presentation", "mentoring", "customer service"
    ]
}

def extract_text_from_pdf(file_bytes):
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_text_from_docx(file_bytes):
    try:
        docx_file = io.BytesIO(file_bytes)
        doc = Document(docx_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return ""

def parse_contact_info(text):
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else ""

    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else ""

    lines = [line.strip() for line in text.split('\n') if line.strip()]
    name = ""
    for line in lines[:3]:
      if not any(kwd in line.lower() for kwd in ["resume", "cv", "curriculum", "email", "phone", "profile", "contact"]):
        name = line
        break
    return name, email, phone

def extract_skills_from_text(text):
    text_lower = text.lower()
    found_tech = []
    for skill in SKILL_KEYWORDS["technical"]:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if skill in ["c++", "c#", "node.js", "next.js", "spring boot"]:
            pattern = re.escape(skill)
        if re.search(pattern, text_lower):
            found_tech.append(skill.title() if len(skill) > 2 else skill.upper())
            
    found_soft = []
    for skill in SKILL_KEYWORDS["soft"]:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_soft.append(skill.title())
    return sorted(list(set(found_tech))), sorted(list(set(found_soft)))

def extract_sections(text):
    sections = {
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": []
    }
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    current_section = None
    
    education_keywords = ["education", "academic", "university", "college", "degree"]
    experience_keywords = ["experience", "employment", "history", "work", "job", "professional"]
    project_keywords = ["project", "personal project", "academic project"]
    certification_keywords = ["certification", "certificates", "license", "credentials"]
    
    for line in lines:
        line_lower = line.lower()
        is_header = False
        if len(line) < 30:
            if any(kwd in line_lower for kwd in education_keywords) and not any(k in line_lower for k in ["details", "details:"]):
                current_section = "education"
                is_header = True
            elif any(kwd in line_lower for kwd in experience_keywords):
                current_section = "experience"
                is_header = True
            elif any(kwd in line_lower for kwd in project_keywords):
                current_section = "projects"
                is_header = True
            elif any(kwd in line_lower for kwd in certification_keywords):
                current_section = "certifications"
                is_header = True
        if is_header:
            continue
        if current_section and len(line) > 5:
            sections[current_section].append(line)
            
    for key in sections:
        sections[key] = sections[key][:12]
    return sections

def parse_resume(file_bytes, filename):
    file_ext = filename.split('.')[-1].lower()
    text = ""
    if file_ext == 'pdf':
        text = extract_text_from_pdf(file_bytes)
    elif file_ext in ['docx', 'doc']:
        text = extract_text_from_docx(file_bytes)
    else:
        text = file_bytes.decode('utf-8', errors='ignore')
        
    name, email, phone = parse_contact_info(text)
    tech_skills, soft_skills = extract_skills_from_text(text)
    sections = extract_sections(text)
    
    return {
        "text": text,
        "name": name,
        "email": email,
        "phone": phone,
        "technicalSkills": tech_skills,
        "softSkills": soft_skills,
        "education": sections["education"],
        "experience": sections["experience"],
        "projects": sections["projects"],
        "certifications": sections["certifications"]
    }
