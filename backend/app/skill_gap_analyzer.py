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
    system = ("Extract technical methods explicitly supported by the supplied paper abstracts. "
              "Return ONLY JSON: {\"methods\":[{\"skill\":\"...\",\"paper_title\":\"...\","
              "\"evidence_quote\":\"exact short substring from abstract\"}]}. "
              "Do not infer lab admission requirements or invent methods. At most 8 methods.")
    raw = generate(json.dumps(papers, ensure_ascii=False), system)
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
        output.append({"skill": skill, "paper_title": title, "evidence_quote": quote, "source_url": paper["link"]})
        if len(output) == 8:
            break
    return output


def _course_matches(skill: str, courses: List[dict], completed: set, limit: int = 2) -> List[dict]:
    stop = {"the", "and", "with", "for", "from", "using", "based", "methods", "learning"}
    target = _terms(skill) - stop
    ranked = []
    for course in courses:
        cid = str(course.get("course_id") or course.get("id") or "")
        if not cid or _code(cid) in completed:
            continue
        title = str(course.get("course_title") or course.get("title") or "")
        description = str(course.get("description") or "")
        topics = str(course.get("topics") or "")
        matched = target & (_terms(title + " " + description + " " + topics) - stop)
        if not matched:
            continue
        score = len(matched) + 0.5 * len(target & _terms(title))
        ranked.append((score, {"course_id": cid, "course_title": title,
                               "reason": "Catalog text mentions: " + ", ".join(sorted(matched)),
                               "source_url": course.get("source_url") or course.get("official_source_url") or ""}))
    ranked.sort(key=lambda x: (-x[0], x[1]["course_id"]))
    return [x[1] for x in ranked[:limit]]


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
    for method in methods:
        skill = method["skill"]
        if skill.casefold().strip() in known:
            status = "self_reported"
        else:
            status = "not_confirmed_in_profile"
        base["suggested_preparation"].append({
            **method,
            "status": status,
            "courses": [] if status == "self_reported" else _course_matches(skill, courses, completed),
        })
    base["notes"].append("Unlisted skills are not proven gaps; course matches are preparation suggestions, not prerequisites.")
    return base
