import time

from app.data_loader import load_courses
from app.semantic_matcher import calculate_semantic_scores


courses = load_courses()

course_texts = [
    " ".join([
        str(c.get("course_title") or ""),
        str(c.get("description") or ""),
        str(c.get("topics") or "")
    ])
    for c in courses
]

for i in range(3):
    start = time.perf_counter()

    scores = calculate_semantic_scores(
        ["natural language processing", "AI"],
        course_texts
    )

    elapsed = time.perf_counter() - start

    print(
        f"Run {i + 1}: {elapsed:.3f} seconds "
        f"({len(scores)} courses)"
    )