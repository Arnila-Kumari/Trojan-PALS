"""pals_research: research matching + course links + research roadmap for Trojan PALS.

    from app.research import Research
    r = Research()                                  # loads ./data once (or Research("path/to/data"))
    out = r.match("NLP applications in healthcare",
                  student={"name": "Ari", "level": "Master's in CS", "background": "built an EEG classifier"})
    out["researchers"]   # ranked researchers with evidence, labs, courses they teach, students who shared
    out["roadmap"]       # 5-stage plan with sourced steps + draft email
    r.course_badge("CSCI-644")                      # research badge for a course card
    r.prep_courses("NLP in healthcare", level="Master's")

All functions are offline and deterministic. Optional LLM extras: see pals_research.llm.
"""

from . import llm
from .data import load
from .matcher import Matcher, interests_in, level_in
from .roadmap import build_roadmap

__all__ = ["Research", "llm"]


class Research:
    def __init__(self, data_dir=None):
        self.data = load(data_dir)
        self.m = Matcher(self.data)

    def match(self, query: str, student: dict | None = None, k: int = 5, cs_only: bool = False,
              explain: bool = False) -> dict:
        student = {k: v for k, v in dict(student or {}).items() if v not in (None, "", [], {})}
        for key in ("name", "level", "program", "background", "interests"):   # accept lists/odd types from callers
            v = student.get(key)
            if isinstance(v, (list, tuple)):
                student[key] = " and ".join(str(x) for x in v if x)
            elif v is not None and not isinstance(v, str):
                student[key] = str(v)
        if not student.get("interests") or interests_in(query):   # the question's topic wins over saved interests
            found = [i if i.isupper() else i.lower() for i in interests_in(query)]
            student["interests"] = (" and ".join([", ".join(found[:-1]), found[-1]]) if len(found) > 1 else
                                    (found[0] if found else query.strip().rstrip("?.")))
        researchers = self.m.match_researchers(query, k=k, cs_only=cs_only)
        if explain:
            for r in researchers[:3]:
                r["explanation"] = llm.explain_research(r)
        return {"query": query, "interests": interests_in(query), "level": level_in(student.get("level", "")) or level_in(query),
                "researchers": researchers, "roadmap": build_roadmap(query, student, researchers, self.m),
                "papers_loaded": len(self.data.papers) > 0}

    def course_badge(self, course_id: str) -> dict:
        return self.m.research_for_course(course_id)

    def prep_courses(self, query: str, level: str | None = None, k: int = 5) -> list[dict]:
        return self.m.prep_courses(query, level, k=k)

    def courses_by_professor(self, professor: str) -> list[dict]:
        pc = self.data.prof_courses
        return pc[pc["professor"] == professor][["course_id", "course_title"]].to_dict("records")
