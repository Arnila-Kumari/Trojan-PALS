# Trojan PALS 🎓

**Your AI-powered academic and research companion at USC.**

Trojan PALS helps University of Southern California students make informed decisions about their academic journey by connecting course recommendations, student experiences, faculty research, and personalized research preparation in one platform.

Instead of searching through course catalogs, professor directories, and research websites separately, students can explore their options through a personalized AI companion.

Built for a USC hackathon.

---

## Features

### 1. AI-Powered Course Recommendations

Discover USC courses based on your academic interests, preferences, and completed coursework.

- Semantic course matching using Sentence Transformers
- Personalized recommendations based on saved student profiles
- Completed-course filtering to avoid recommending courses already taken
- Consideration of assessment preferences, workload, and student reviews
- Course descriptions, prerequisite information, and relevant student experiences

Recommendations are intended to support academic planning, not predict grades or guarantee enrollment.

### 2. AI Academic Companion

Chat with Trojan PALS using natural language to explore courses and research opportunities.

**Example questions:**

- "I want to take an NLP course with more projects than exams."
- "I've already completed CSCI 544. What should I take next?"
- "Which courses would help me prepare for machine learning research?"
- "How can I get involved in Kallirroi Georgila's research?"

The chatbot uses Groq-hosted language models, integrates saved student preferences, and routes requests to the appropriate recommendation or research workflow.

### 3. Research Discovery

Explore USC faculty members, laboratories, and research areas based on your interests.

- Researcher matching using TF-IDF and research-topic expansion
- Faculty and laboratory information sourced from USC resources
- Research-paper metadata and abstracts collected through OpenAlex
- Relevant course and faculty connections
- Links to supporting research evidence

Students can discover researchers even when they are unfamiliar with specific laboratory names.

### 4. Personalized Research Roadmaps

Trojan PALS generates actionable research pathways that help students move from discovering a research interest to preparing for potential involvement.

Roadmaps include:

1. **Explore:** Learn about the professor's research and relevant publications.
2. **Prepare:** Identify useful USC courses and foundational knowledge.
3. **Reach out:** Prepare a personalized professor outreach email.
4. **Get involved:** Explore research enrollment pathways and departmental opportunities.
5. **Keep going:** Track progress and consider alternative research connections.

Students can save roadmaps and track completed steps.

### 5. AI Research Readiness Analyzer

Our Research Readiness Analyzer helps students understand how their existing academic background connects to a professor's published research.

**How it works:**

1. Retrieves eligible research-paper abstracts associated with a selected professor.
2. Uses an LLM to extract technical research methods supported by the abstracts.
3. Identifies broader foundational topics relevant to those methods.
4. Compares the extracted skills with the student's self-reported background.
5. Uses semantic similarity to identify potentially relevant USC preparation courses.
6. Excludes completed courses and provides links to supporting publications.

**Example:**

A student interested in conversational AI may discover preparation areas such as language-model fine-tuning, statistical machine learning, dialogue embeddings, and model evaluation.

The analyzer distinguishes explicitly reported skills, related foundations, and skills not confirmed by the profile.

These are preparation suggestions, not verified skill deficiencies or official laboratory admission requirements.

### 6. Student Profiles and Reviews

Trojan PALS supports personalized accounts through Supabase.

- Google authentication
- Student profile onboarding and editing
- Saved interests and completed courses
- Persistent course reviews and saved courses
- Saved research roadmaps
- Profile-aware AI recommendations

Student-submitted reviews and imported sample records are distinguished from official academic information.

---

## AI and System Architecture

Trojan PALS combines semantic retrieval, structured LLM extraction, recommendation logic, and evidence-grounded research guidance.

| Component | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React, TypeScript | User interface and application routing |
| Authentication and database | Supabase, PostgreSQL | Accounts, profiles, reviews, and saved data |
| Backend | Python, FastAPI | AI services and recommendation endpoints |
| LLM | Groq API | Conversational guidance and structured research extraction |
| Semantic matching | Sentence Transformers | Course and research-skill similarity |
| Research matching | TF-IDF, scikit-learn | Researcher discovery and topic matching |
| Research publications | OpenAlex | Publication metadata and abstracts |
| Academic information | USC course and faculty resources | Course preparation and research context |

### Research Readiness Pipeline

```text
Student Profile + Research Interest
                |
                v
        Researcher Discovery
                |
                v
       Research Paper Retrieval
                |
                v
      Groq Research Method Extraction
                |
                v
       Evidence Quote Validation
                |
                v
      Student Skill Comparison
                |
                v
      Semantic USC Course Matching
                |
                v
     Personalized Research Readiness
```

Research methods must be supported by supplied paper abstracts. Records with unresolved author-attribution warnings are excluded from readiness extraction.

---

## Getting Started

### Prerequisites

- Node.js 22+
- Python 3.11+
- npm
- Supabase project with Google OAuth configured
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/Arnila-Kumari/Trojan-PALS.git
cd Trojan-PALS
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up the Python Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Create `backend/.env`:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Use a Groq model available to your API account.

### 4. Configure Supabase and Frontend Environment

Follow [BACKEND_SETUP.md](BACKEND_SETUP.md) to configure Supabase, Google OAuth, database migrations, and seed data.

Create `.env.local` in the repository root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
FASTAPI_INTERNAL_URL=http://127.0.0.1:8000
```

Never commit API keys, database secrets, or local environment files.

### 5. Start the Backend

From `backend/`:

```bash
python -m uvicorn app.main:app --reload
```

FastAPI documentation is available at:

`http://127.0.0.1:8000/docs`

### 6. Start the Frontend

From the repository root, in another terminal:

```bash
npm run dev
```

Open:

`http://localhost:3000`

Use `localhost` consistently when testing Google authentication.

---

## Testing

### Frontend

```bash
npm test
npm run build
```

### Backend

```bash
cd backend
python -m pytest -q
```

### AI API Endpoints

| Endpoint | Function |
|---|---|
| `POST /recommend` | Personalized course recommendations |
| `POST /chat` | Course recommendation chatbot |
| `POST /chat/route` | Unified academic and research chatbot |
| `POST /roadmap` | Professor-specific research roadmap |
| `POST /research/match` | Researcher matching and research pathways |
| `POST /research/readiness` | AI-powered research skill-gap analysis |

The frontend uses authenticated Next.js API routes to communicate with the Python services.

---

## Data Sources and Responsible AI

Trojan PALS combines official academic sources, research metadata, and student-contributed information.

- **USC:** Course catalog, schedule, faculty profiles, and laboratory information
- **OpenAlex:** Research publication metadata and abstracts
- **Student reviews:** Imported examples and authenticated student contributions
- **Student profiles:** Saved preferences and self-reported academic background

**Important limitations:**

- Course recommendations are advisory and do not guarantee enrollment, grades, or eligibility.
- Course availability, prerequisites, and instructor assignments should be confirmed through official USC resources.
- Research similarity does not imply an available laboratory position.
- Research-paper attribution may require manual verification.
- Extracted research methods are evidence-grounded, but broader preparation topics and course matches are AI-generated suggestions.
- Completed coursework does not automatically establish mastery of every related skill.
- Synthetic student examples are not real, contactable mentors.

---

## Future Improvements

- More comprehensive, verified publication coverage
- Improved semantic researcher discovery
- Expanded student skill profiles
- More detailed research readiness visualizations
- Additional evaluation of course-to-skill relevance
- Production deployment and scalability improvements

---

## Project Repository

[GitHub — Trojan PALS](https://github.com/Arnila-Kumari/Trojan-PALS)

**Trojan PALS — Discover courses. Explore research. Build your path.**
