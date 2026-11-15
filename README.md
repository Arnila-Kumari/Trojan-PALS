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

Students can save roadmaps and track completed
