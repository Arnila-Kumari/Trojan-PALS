"""Evidence-grounded research readiness analysis for Trojan PALS.

Independent of the existing matcher, roadmap, and chat services.
The caller supplies matched research papers, catalog courses, and student profile.
"""
import json
import re
from typing import Any, Callable, Dict, List, Optional


def _code(value: Any) -> str:
    return re.sub(r"[^A-Z0-9]", "", str(value or "").upper())


def _terms(value: Any) -> set:
    return set(re.findall(r"[a-z0-9]+", str(value or "").lower()))


def _paper_evidence(papers: List[dict], limit: int = 5) -> List[dict]:
    result = []
    for p in papers:
        abstract = str(p.get("abstract") or "").strip()
        title = str(p.get("paper_title") or p.get("title") or "").strip()
        link = str(p.get("link") or p.get("source_url") or "").strip()
        status = str(p.get("status") or "OK").upper()
        if title and abstract and abstract != "No abstract in OpenAlex" and link and status == "OK":
            result.append({"paper_title": title, "abstract": abstract[:8000], "link": link})
    return result[:limit]


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw).strip()
    obj = json.loads(raw)
    if not isinstance(obj, dict) or not isinstance(obj.get("methods"), list):
        raise ValueError("Expected JSON object with methods list")
    return obj


def _extract_methods(papers: List[dict], generate: Callable[[str, str], str]) -> List[dict]:
    
    system = """
    You are analyzing scientific research papers to identify
    transferable research skills and academic foundations.

    Return ONLY a valid JSON object in this format:

    {
    "methods": [
        {
        "skill": "Specific research technique",
        "foundational_topic": "Broader academic subject",
        "paper_title": "Exact supplied paper title",
        "evidence_quote": "Exact substring from the abstract"
        }
    ]
    }

    Rules:
    1. Extract at most 6 distinct research methods.
    2. Skills must be supported by the supplied abstracts.
    3. Each evidence_quote must appear exactly in its abstract.
    4. Identify a broader foundational_topic that could help
    a student understand or learn the method.
    5. Examples of foundational topics include:
    statistical machine learning, natural language processing,
    representation learning, deep learning, computer vision,
    speech processing, and data visualization.
    6. Do not use product or model names alone as skills.
    7. Do not invent research methods, course coverage,
    prerequisites, or lab admission requirements.
    8. A foundational topic is a suggested preparation area,
    not a verified requirement of the research lab.
    9. Return only JSON, without Markdown formatting.
    """
    raw = generate(json.dumps(papers, ensure_ascii=False), system)
    print("RAW GROQ EXTRACTION:", repr(raw[:2000]), flush=True)
    proposed = _parse_json(raw).get("methods", [])
    indexed = {p["paper_title"]: p for p in papers}
    output, seen = [], set()
    for item in proposed[:20]:
        if not isinstance(item, dict):
            continue
        skill = str(item.get("skill") or "").strip()[:100]
        title = str(item.get("paper_title") or "").strip()
        quote = str(item.get("evidence_quote") or "").strip()
        paper = indexed.get(title)
        if not paper or not skill or len(skill) < 3 or not quote or len(quote) > 240:
            continue
        if quote.casefold() not in paper["abstract"].casefold():
            continue
        key = skill.casefold()
        if key in seen:
            continue
        seen.add(key)
        foundation = str(
            item.get("foundational_topic") or ""
        ).strip()[:120]

        output.append({
            "skill": skill,
            "foundational_topic": foundation or skill,
            "paper_title": title,
            "evidence_quote": quote,
            "source_url": paper["link"],
        })
        if len(output) == 8:
            break
    return output

def _course_matches(
    skill: str,
    courses: List[dict],
    completed: set,
    limit: int = 2,
) -> List[dict]:
    """Find academically relevant courses using semantic similarity."""

    from functools import lru_cache
    from sentence_transformers import SentenceTransformer
    from sentence_transformers import util

    @lru_cache(maxsize=1)
    def get_model():
        return SentenceTransformer("all-MiniLM-L6-v2")

    candidates = []

    for course in courses:
        cid = str(
            course.get("course_id")
            or course.get("id")
            or ""
        )

        if not cid or _code(cid) in completed:
            continue

        title = str(
            course.get("course_title")
            or course.get("title")
            or ""
        )

        description = str(
            course.get("description")
            or ""
        )

        topics = str(course.get("topics") or "")

        if not title:
            continue

        candidates.append({
            "course_id": cid,
            "course_title": title,
            "text": (
                f"{title}. {title}. "
                f"{description}. {topics}"
            ),
            "source_url": (
                course.get("source_url")
                or course.get("official_source_url")
                or ""
            ),
        })

    if not candidates:
        return []

    model = get_model()

    skill_embedding = model.encode(
        skill,
        convert_to_tensor=True,
    )

    course_embeddings = model.encode(
        [c["text"] for c in candidates],
        convert_to_tensor=True,
    )

    similarities = util.cos_sim(
        skill_embedding,
        course_embeddings,
    )[0]

    ranked = []

    for i, course in enumerate(candidates):
        similarity = float(similarities[i])

        # Conservative relevance threshold.
        if similarity < 0.42:
            continue

        level_match = re.search(
            r"(\d{3})",
            course["course_id"]
        )

        level_bonus = 0.0

        if level_match:
            level = int(level_match.group(1)) // 100

            level_bonus = {
                5: 0.025,
                6: 0.015,
                4: 0.005,
            }.get(level, 0.0)

        ranked.append((
            similarity + level_bonus,
            similarity,
            course,
        ))

    ranked.sort(key=lambda x: -x[0])

    return [
        {
            "course_id": course["course_id"],
            "course_title": course["course_title"],
            "reason": (
                "Course content is semantically related "
                "to this research method."
            ),
            "source_url": course["source_url"],
        }
        for _, _, course in ranked[:limit]
    ]

def generate_skill_gap_analysis(
    student: Dict[str, Any],
    research_match: Dict[str, Any],
    courses: List[Dict[str, Any]],
    generate: Optional[Callable[[str, str], str]] = None,
) -> Dict[str, Any]:
    """Analyze a research match (as returned by match_researchers).

    `generate(prompt, system_prompt)` can be app.llm_client.generate_text.
    Returns no asserted missing skills without verifiable paper evidence.
    """
    skills = [str(s) for s in (student.get("skills") or []) if str(s).strip()]
    completed_raw = student.get("completed_courses") or student.get("completed") or []
    completed = {_code(c) for c in completed_raw}
    papers = _paper_evidence(research_match.get("papers") or [])
    base = {"professor": research_match.get("professor"),
            "existing_skills": skills, "completed_courses": list(completed_raw),
            "evidence_level": "paper_abstracts" if papers else "insufficient_paper_evidence",
            "suggested_preparation": [], "notes": []}
    if not papers:
        base["notes"].append("No verified paper abstracts available for method extraction. No skill gaps inferred.")
        return base
    if generate is None:
        base["notes"].append("LLM method extractor not configured. No skill gaps inferred.")
        return base
    try:
        methods = _extract_methods(papers, generate)
    except (ValueError, TypeError, RuntimeError, OSError) as exc:
        base["notes"].append("Method extraction unavailable: " + type(exc).__name__)
        return base
    known = {s.casefold().strip() for s in skills}
    def has_related_foundation(
        foundation: str,
        known_skills: set,
    ) -> bool:
        """Detect broad, explicitly reported academic foundations."""

        aliases = {
            "machine learning": {
                "machine learning", "ml",
            },
            "deep learning": {
                "deep learning", "neural networks",
            },
            "natural language processing": {
                "natural language processing", "nlp",
            },
            "statistics": {
                "statistics", "statistical modeling",
            },
            "computer vision": {
                "computer vision", "image processing",
            },
            "data visualization": {
                "data visualization", "visualization",
            },
        }

        foundation_text = foundation.casefold()

        for topic, terms in aliases.items():
            if topic in foundation_text:
                if known_skills & terms:
                    return True

        return False
    for method in methods:
        skill = method["skill"]
        foundation = method.get("foundational_topic") or ""
        if skill.casefold().strip() in known:
            status = "self_reported"
        elif has_related_foundation(foundation, known):
            status = "related_foundation"
        else:
            status = "not_confirmed_in_profile"
        base["suggested_preparation"].append({
            **method,
            "status": status,
            "courses": (
                []
                if status == "self_reported"
                else _course_matches(
                    method.get("foundational_topic") or skill,
                    courses,
                    completed,
                )
            ),
        })
    base["notes"].append("Unlisted skills are not proven gaps; course matches are preparation suggestions, not prerequisites.")
    return base
