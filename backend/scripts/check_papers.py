"""Show which professors' OpenAlex papers the app uses and which it drops as probable mismatches.
Run from backend/:  python scripts/check_papers.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.research.data import DEFAULT_DIR, _read, check_papers  # noqa: E402

papers = _read(DEFAULT_DIR / "papers.csv", required=False)
review = _read(DEFAULT_DIR / "review.csv", required=False)
faculty = _read(DEFAULT_DIR / "research_mentors.csv")
kept, dropped = check_papers(papers, review, faculty)
print(f"Using {len(kept)} papers for {kept['professor'].nunique() if len(kept) else 0} professors.")
print(f"Dropped {sum(d['papers'] for d in dropped)} papers for {len(dropped)} professors:")
for d in dropped:
    print(f"  - {d['professor']}: {d['reason']}")
