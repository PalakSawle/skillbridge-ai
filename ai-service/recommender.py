ROADMAP_DB = {
    "Docker": {
        "difficulty": "Intermediate",
        "steps": [
            "Understand containers vs virtual machines and install Docker Desktop.",
            "Write a Dockerfile to containerize a Node.js or Python application.",
            "Learn multi-container setups using Docker Compose and networking."
        ],
        "resources": [
            {"title": "Docker Official Get Started Guide", "url": "https://docs.docker.com/get-started/", "type": "documentation"},
            {"title": "Docker for Beginners (FreeCodeCamp)", "url": "https://www.youtube.com/watch?v=pg19Z840I4c", "type": "video"},
            {"title": "Docker Technologies (Udemy)", "url": "https://www.udemy.com/topic/docker/", "type": "course"}
        ]
    },
    "Kubernetes": {
        "difficulty": "Advanced",
        "steps": [
            "Learn Kubernetes core concepts: Pods, Services, Deployments, and ReplicaSets.",
            "Set up a local cluster using Minikube or MicroK8s.",
            "Deploy a containerized application with service exposure and environment secrets config."
        ],
        "resources": [
            {"title": "Kubernetes Basics Tutorial", "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "type": "documentation"},
            {"title": "Kubernetes Crash Course (TechWorld with Nana)", "url": "https://www.youtube.com/watch?v=X48VuDVv0do", "type": "video"}
        ]
    },
    "AWS": {
        "difficulty": "Intermediate",
        "steps": [
            "Set up an AWS Free Tier account and learn Identity & Access Management (IAM).",
            "Deploy virtual servers with EC2 and store static assets in S3 buckets.",
            "Understand AWS serverless concepts using AWS Lambda, API Gateway, and DynamoDB."
        ],
        "resources": [
            {"title": "AWS Cloud Practitioner Essentials", "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", "type": "course"},
            {"title": "AWS Tutorial for Beginners (Edureka)", "url": "https://www.youtube.com/watch?v=3hLmDS179YE", "type": "video"}
        ]
    },
    "React": {
        "difficulty": "Beginner",
        "steps": [
            "Master modern ES6 JavaScript concepts (arrow functions, destructuring, promises).",
            "Learn React core elements: Components, JSX, Props, and State Hook (useState).",
            "Build dynamic single-page applications utilizing React Router, Context API, and Axios integrations."
        ],
        "resources": [
            {"title": "React.dev Quick Start", "url": "https://react.dev/learn", "type": "documentation"},
            {"title": "React JS Course (Scrimba)", "url": "https://scrimba.com/learn/learnreact", "type": "course"}
        ]
    },
    "TypeScript": {
        "difficulty": "Intermediate",
        "steps": [
            "Learn basic type annotations, interfaces, type aliases, and union types.",
            "Configure compiler settings via tsconfig.json and migrate JS projects.",
            "Apply generics, decorators, and advanced utility types to React or Node architectures."
        ],
        "resources": [
            {"title": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/handbook/intro.html", "type": "documentation"},
            {"title": "TypeScript Tutorial (Net Ninja)", "url": "https://www.youtube.com/watch?v=2pZmKW9-I_k", "type": "video"}
        ]
    },
    "Node.js": {
        "difficulty": "Intermediate",
        "steps": [
            "Learn Node.js runtime fundamentals, event loop, and fs module operations.",
            "Build HTTP servers using Express framework and manage routing middleware.",
            "Implement secure JWT authentication, password hashing, and connect to Mongoose."
        ],
        "resources": [
            {"title": "Node.js Learning Path", "url": "https://nodejs.org/en/learn", "type": "documentation"},
            {"title": "Node.js Express MongoDB Course (FreeCodeCamp)", "url": "https://www.youtube.com/watch?v=Oe421EPjeBE", "type": "video"}
        ]
    },
    "Python": {
        "difficulty": "Beginner",
        "steps": [
            "Learn basic Python syntax, data structures (lists, dicts, tuples), and loops.",
            "Understand object-oriented programming (OOP), file Handling, and error structures.",
            "Explore Python backend frameworks like FastAPI/Flask or data libraries like Pandas."
        ],
        "resources": [
            {"title": "Python.org Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "documentation"},
            {"title": "Python for Beginners (Mosh)", "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc", "type": "video"}
        ]
    },
    "Machine Learning": {
        "difficulty": "Advanced",
        "steps": [
            "Brush up on statistics, linear algebra, calculus, and basic probability concepts.",
            "Implement classical algorithms (regression, decision trees, SVM) using Scikit-Learn.",
            "Learn model evaluation methodologies, feature scaling, and tuning hyperparameters."
        ],
        "resources": [
            {"title": "Machine Learning by Andrew Ng (Coursera)", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "type": "course"},
            {"title": "StatQuest Machine Learning Videos", "url": "https://youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF", "type": "video"}
        ]
    }
}

def get_default_roadmap(skill):
    return {
        "difficulty": "Intermediate",
        "steps": [
            f"Study the core documentation and basic concepts of {skill}.",
            f"Build a simple sandbox/test project incorporating {skill} functionalities.",
            f"Review advanced production patterns, deployment strategies, and optimization rules for {skill}."
        ],
        "resources": [
            {"title": f"Google Search for {skill} tutorials", "url": f"https://www.google.com/search?q={skill}+tutorial", "type": "search"},
            {"title": f"Official {skill} Website / Docs", "url": "https://www.wikipedia.org", "type": "documentation"}
        ]
    }

def generate_roadmap(missing_skills):
    roadmap = []
    for skill in missing_skills:
        skill_clean = skill.strip()
        matched_key = None
        for key in ROADMAP_DB:
            if key.lower() == skill_clean.lower():
                matched_key = key
                break
        if matched_key:
            data = ROADMAP_DB[matched_key]
            roadmap.append({
                "skill": skill,
                "difficulty": data["difficulty"],
                "steps": data["steps"],
                "resources": data["resources"]
            })
        else:
            roadmap.append({
                "skill": skill,
                **get_default_roadmap(skill)
            })
    return roadmap[:8]

def generate_interview_prep(found_skills, missing_skills, resume_data):
    prep = []
    tech_pool = {
        "Docker": {
            "question": "What is the difference between a Docker image and a Docker container, and how does layering work in a Dockerfile?",
            "answerHint": "An image is a read-only template containing instructions. A container is a runnable instance of an image. Layering is used to cache steps, reducing build times."
        },
        "Kubernetes": {
            "question": "Explain the Kubernetes architecture. What are Pods, Deployments, and Services, and how do they communicate?",
            "answerHint": "Pods are the smallest deployable units. Deployments manage pod scaling and rollouts. Services define logical sets of pods and enable persistent network access."
        },
        "React": {
            "question": "What are React hooks? Explain the rules of hooks and how the useEffect clean-up function operates.",
            "answerHint": "Hooks let you use state and lifecycle features in functional components. Rules: call at top level, only from React functions. Clean-up executes before unmounting or re-running."
        },
        "Node.js": {
            "question": "What is the event loop in Node.js? How does Node.js handle non-blocking asynchronous I/O operations?",
            "answerHint": "Node.js runs single-threaded using an event loop to delegate heavy I/O operations to system threads (Libuv pool), triggering callbacks when completed."
        },
        "SQL": {
            "question": "What are database indexes, and how do they improve query performance? Are there any drawbacks?",
            "answerHint": "Indexes speed up data retrieval by creating lookup trees (B-trees). Drawbacks: extra storage required, slower write operations (INSERT/UPDATE/DELETE)."
        }
    }
    
    tech_added = 0
    all_target_skills = missing_skills + found_skills
    for skill in all_target_skills:
        for key in tech_pool:
            if key.lower() == skill.lower():
                prep.append({
                    "question": tech_pool[key]["question"],
                    "answerHint": tech_pool[key]["answerHint"],
                    "category": "technical"
                })
                tech_added += 1
                break
        if tech_added >= 3:
            break
            
    if tech_added < 3:
        fallbacks = [
            {
                "question": "Describe a challenging technical bug you encountered in a recent project and the systematic approach you took to debug it.",
                "answerHint": "Structure your answer using Star method: describe the Situation, Task, Action (tools used like log analysis, debugger), and the Result.",
                "category": "technical"
            },
            {
                "question": "Explain the difference between synchronous and asynchronous code. When would you use one over the other?",
                "answerHint": "Synchronous block execution; asynchronous triggers non-blocking execution (e.g. database reads, API fetches) to maximize concurrency.",
                "category": "technical"
            }
        ]
        for f in fallbacks[:(3 - tech_added)]:
            prep.append(f)
            
    hr_questions = [
        {
            "question": "Tell me about a time you had to work with a difficult team member on a group assignment or project. How did you resolve it?",
            "answerHint": "Focus on active listening, empathy, objective problem solving, and mutual compromise. Highlight the successful completion of the project.",
            "category": "behavioral"
        },
        {
            "question": "How do you handle strict deadlines or competing priorities when you have multiple exams and coding projects due?",
            "answerHint": "Talk about prioritization matrices (urgent vs important), timeblocking calendars, setting expectations early, and breaking tasks into smaller steps.",
            "category": "behavioral"
        }
    ]
    prep.extend(hr_questions)
    
    projects = resume_data.get("projects", [])
    if projects:
        proj_name = projects[0][:40] + "..." if len(projects[0]) > 40 else projects[0]
        prep.append({
            "question": f"In your resume, you listed the project '{proj_name}'. What was the architectural design, and what trade-offs did you make during development?",
            "answerHint": "Explain the technology stack selected, why it was chosen over alternatives, and how you solved scaling, security, or state management issues.",
            "category": "project-based"
        })
    else:
        prep.append({
            "question": "Choose one of your major programming projects. If you had to rewrite it from scratch today, what architecture or library would you change and why?",
            "answerHint": "Demonstrate self-reflection, learning growth, and deep understanding of modern framework comparisons.",
            "category": "project-based"
        })
        
    return prep
