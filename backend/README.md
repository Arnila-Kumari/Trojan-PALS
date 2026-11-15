# Trojan PALS v4 — Gemini Chat + Spring 2027 Course Recommender

## What changed
- Original six user-provided reviews retained.
- Replaced earlier 7 teammate intake records with the **latest 21 teammate-provided records** (27 reviews total).
- All new records marked `TEAMMATE_SUPPLIED_UNVERIFIED` pending confirmation. Some directly conflict with previous accounts; no data was overwritten or averaged away.
- Course+professor historical review matching preserved. Spring 2027 professor assignments remain unverified; reviews will only attach when a matching instructor is verified in `data/spring2027_offerings.csv`.
- New Gemini-backed `POST /chat` endpoint accepts plain English, calls existing recommendation engine, and explains results with evidence. Existing `/recommend` remains unchanged.

## Run
```bash
python3 -m pip install -r requirements.txt
cp .env.example .env
# Edit .env locally to set GEMINI_API_KEY (never commit it)
python3 -m uvicorn app.main:app --reload
```
Open http://127.0.0.1:8000/docs and test `POST /chat` with:
```json
{
  "message": "I want to study natural language processing, prefer projects over exams, and need a manageable workload",
  "history": [],
  "preferences": {}
}
```
For follow-ups, send the previous response's `preferences` back, plus the chat history.

**Important:** The API needs network access and a Gemini API key. The chat endpoint was not exercised against Gemini because no key was supplied. No API key is stored in the project.

## Data quality
`student_reviews.csv` contains 6 user-provided reports and 21 teammate-provided unverified reports. Multiple reviews for the same course/professor are retained. Some reviews disagree significantly. Do not represent teammate entries as genuine student feedback until provenance is confirmed. `data/teammate_reviews_raw.json` preserves the exact latest intake.
