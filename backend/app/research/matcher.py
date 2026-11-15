"""Course + research matching. Offline (TF-IDF), no API key needed.

Three directions:
  match_researchers(query)        student words -> researchers, with sourced evidence
  research_for_course(course_id)  a course card -> who does research in it (badge for the course page)
  prep_courses(query, ...)        student words -> Spring 2027 courses that build toward that research

Every researcher profile is built only from sourced text:
  papers (title + abstract)  > lab/center names + themes  > Spring 2027 courses taught  > USC research areas
`method` says which evidence existed, so a card never cites a paper we don't have.
"""

import re

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

from .data import Data, course_num

INTERESTS = {
    "NLP": r"nlp|natural language|language models?|llms?|text|linguistic|dialogue|chatbots?|translation",
    "Machine Learning": r"machine learning|\bml\b|supervised|predictive",
    "Deep Learning": r"deep learning|neural networks?|transformers?",
    "Computer Vision": r"computer vision|\bvision\b|\bcv\b|images?|video",
    "Robotics": r"robot\w*|embodied|autonomous",
    "Healthcare": r"health\w*|medical|clinical|medicine|biomedical|patients?",
    "Security": r"security|cyber\w*|cryptograph\w*|crypto|privacy|safety|safe\b|malware|hack\w*|threat\w*|attack\w*",
    "Databases": r"databases?|sql|data management",
    "Systems": r"operating systems?|distributed|cloud|computer architecture",
    "Networks": r"network\w*|internet",
    "Algorithms": r"algorithms?|theory|complexity",
    "Graphics": r"graphics|rendering|animation|\b3d\b",
    "Games": r"games?",
    "AR/VR": r"\bar\b|\bvr\b|virtual reality|augmented|mixed reality|smart glasses|wearables?",
    "HCI": r"\bhci\b|user experience|\bux\b|human.computer|accessibility|assistive",
    "Data Science": r"data science|analytics|data mining|big data|visuali[sz]ation",
    "Software Engineering": r"software engineering|testing|verification|program synthesis",
    "AI": r"\bai\b|artificial intelligence|agents?|reasoning|planning",
    "Fairness & Society": r"fairness|bias|ethic\w*|societ\w*|social|misinformation",
    "Neuroscience": r"neuro\w*|brain|cognitive",
    "Quantum": r"quantum",
    "Optimization": r"optimi[sz]ation",
}
EXPAND = {
    "NLP": "natural language processing language models nlp text information extraction question answering dialogue linguistics speech",
    "Machine Learning": "machine learning statistical learning learning from data",
    "Deep Learning": "deep learning neural networks",
    "Computer Vision": "computer vision visual images 3d reconstruction visual reasoning",
    "Robotics": "robotics robots robotic manipulation control embodied autonomy",
    "Healthcare": "health healthcare medical medicine clinical diagnostics therapeutics imaging neurology otolaryngology pediatrics accessibility",
    "Security": "security cybersecurity computer security network security privacy cryptography trusted systems attacks",
    "Databases": "database systems relational databases data management",
    "Systems": "operating systems distributed systems cloud computing",
    "Networks": "computer networks networking protocols internet",
    "Algorithms": "algorithms theory complexity",
    "Graphics": "computer graphics rendering animation",
    "Games": "game development game engines",
    "AR/VR": "augmented virtual mixed reality immersive wearable",
    "HCI": "human computer interaction user experience accessibility assistive interaction",
    "Data Science": "data science data mining analytics visualization",
    "Software Engineering": "software engineering verification program synthesis",
    "AI": "artificial intelligence intelligent systems reasoning planning agents",
    "Fairness & Society": "fairness bias societal impact social science",
    "Neuroscience": "neuroscience brain cognitive computational neuroscience",
    "Quantum": "quantum computing",
    "Optimization": "optimization",
}
NOT_ELECTIVE = re.compile(r"thesis|dissertation|directed research|^research$|colloquium|seminar in|practicum|senior project", re.I)


def interests_in(text: str) -> list[str]:
    t = (text or "").lower()
    return [k for k, p in INTERESTS.items() if re.search(rf"\b(?:{p})\b", t)]


def level_in(text: str) -> str | None:
    t = (text or "").lower()
    if re.search(r"undergrad\w*|freshman|sophomore|junior|senior\b|\bbs\b|bachelor", t):
        return "Undergraduate"            # first: "undergraduate" contains "graduate"
    if re.search(r"\bph\.?d\b|doctoral", t):
        return "PhD"
    if re.search(r"\bmasters?\b|master's|\bms\b|\bmscs\b|\bmsds\b|\bgraduate\b", t):
        return "Master's"
    return None


def query_text(query: str) -> str:
    return " ".join([query] + [EXPAND.get(i, i) for i in interests_in(query)]).lower()


class Matcher:
    def __init__(self, data: Data):
        self.d = data
        self._build_profiles()
        self._build_courses()

    # ---------- researchers ----------
    def _build_profiles(self):
        d, rows = self.d, []
        for f in d.faculty.itertuples(index=False):
            labs = [x for x in f.lab_name.split("; ") if x]
            courses = d.prof_courses[d.prof_courses["professor"] == f.professor]
            papers = d.papers[d.papers["professor"] == f.professor] if len(d.papers) else d.papers
            ptext = " ".join(f"{p.paper_title} {getattr(p, 'abstract', '') or getattr(p, 'summary', '')}"
                             for p in papers.itertuples())
            ctext = " ".join(f"{r.course_title} {(d.course(r.course_id) or {}).get('description', '')}"
                             for r in courses.itertuples())
            ltext = " ".join(f"{l} {d.lab_areas(l)} {d.lab_about(l)} {d.lab_about(l)}" for l in labs)
            rows.append({"professor": f.professor, "department": f.department, "areas": f.areas,
                         "profile_url": getattr(f, "profile_url", "") or getattr(f, "source_link", ""),
                         "labs": labs, "courses": courses[["course_id", "course_title"]].to_dict("records"),
                         "papers": papers.to_dict("records"),
                         "text": f"{ptext} {ptext} {ltext} {ctext} {f.areas} {f.department}".replace(";", " ").lower()})
        self.profiles = rows
        self.pvec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)
        self.P = self.pvec.fit_transform([r["text"] for r in rows])

    def _evidence(self, p, qv):
        d = self.d
        cands = [("paper", x["paper_title"], x.get("link", ""), f"{x['paper_title']} {x.get('abstract', '')}") for x in p["papers"]]
        cands += [("lab", l, d.lab_link(l), f"{l} {d.lab_areas(l)} {d.lab_about(l)}") for l in p["labs"]]
        cands += [("course", f"{c['course_id']} {c['course_title']}", (d.course(c["course_id"]) or {}).get("source_url", ""),
                   f"{c['course_title']} {(d.course(c['course_id']) or {}).get('description', '')}") for c in p["courses"]]
        if not cands:
            return None
        sims = (self.pvec.transform([t.lower() for *_, t in cands]) @ qv.T).toarray().ravel()
        i = int(np.argmax(sims))
        kind, label, link, _ = cands[i]
        ev = {"kind": kind, "label": label, "link": link}
        if kind == "lab":
            themes = [t for t in d.lab_areas(label).split("; ") if t]
            words = re.findall(r"[a-z]{4,}", self._qt)
            best = sorted(((sum(w[:6] in t.lower() for w in words), t) for t in themes), reverse=True)
            ev["theme"] = best[0][1] if best and best[0][0] else ""
        return ev

    @staticmethod
    def _why(ev):
        if not ev:
            return "Listed under matching USC research areas."
        if ev["kind"] == "paper":
            return f"Recent paper: \"{ev['label']}\"."
        if ev["kind"] == "lab":
            return f"Member of {ev['label']}" + (f" (theme: {ev['theme']})." if ev.get("theme") else ".")
        return f"Teaches {ev['label']} in Spring 2027."

    def match_researchers(self, query: str, k: int = 5, cs_only: bool = False) -> list[dict]:
        self._qt = query_text(query)
        qv = self.pvec.transform([self._qt])
        sims = (self.P @ qv.T).toarray().ravel()
        # Rank research-active faculty (a lab or loaded papers) above people matched only by courses they teach.
        active = np.array([1.0 if (p["labs"] or p["papers"]) else 0.7 for p in self.profiles])
        sims = sims * active
        out, seen = [], {}
        for i in np.argsort(-sims):
            if sims[i] <= 0 or len(out) >= k:
                break
            p = self.profiles[i]
            if cs_only and "CS" not in p["department"]:
                continue
            ev = self._evidence(p, qv)
            key = ev["label"] if ev else "areas"
            if seen.get(key, 0) >= 2:          # don't fill the list with one shared lab theme
                continue
            seen[key] = seen.get(key, 0) + 1
            out.append({
                "professor": p["professor"], "department": p["department"], "areas": p["areas"],
                "profile_url": p["profile_url"], "fit": round(float(sims[i]), 3), "evidence": ev, "why": self._why(ev),
                "labs": [{"name": l, "link": self.d.lab_link(l)} for l in p["labs"]],
                "courses_taught": p["courses"], "papers": p["papers"][:3],
                "students_shared": self.experiences(p["labs"], p["professor"]),
                "method": "papers" if p["papers"] else "profile (areas, labs, courses; no papers loaded)",
            })
        if out:
            top = out[0]["fit"] or 1
            for r in out:
                r["fit_pct"] = round(100 * r["fit"] / top)
        return out

    def experiences(self, labs, professor=None):
        rows = [e for e in self.d.experiences if e.get("lab_name") in labs or (professor and e.get("professor") == professor)]
        how = {}
        for e in rows:
            how[e.get("how_got_in", "Other")] = how.get(e.get("how_got_in", "Other"), 0) + 1
        keep = ("display_name", "role", "started", "how_got_in", "hours_per_week", "helpful_courses", "tip", "open_to_contact")
        return {"n": len(rows), "how_got_in": how, "students": [{k: e.get(k) for k in keep} for e in rows]}

    # ---------- courses ----------
    def _build_courses(self):
        c = self.d.courses.copy()
        c["elective"] = ~c["course_title"].str.contains(NOT_ELECTIVE)
        self.cdf = c.reset_index(drop=True)
        self.cvec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)
        self.C = self.cvec.fit_transform((c["course_title"] + ". " + c["course_title"] + ". " + c["description"]).str.lower())

    def research_for_course(self, course_id: str, k: int = 3) -> dict:
        """Badge data for a course card: researchers teaching it in Spring 2027, else researchers whose
        profile matches the course topic."""
        c = self.d.course(course_id)
        if not c:
            return {"course_id": course_id, "type": None, "researchers": []}
        teaching = self.d.course_profs.get(course_id, [])
        if teaching:
            return {"course_id": course_id, "type": "taught by a researcher",
                    "researchers": [{"professor": p, "labs": [x["name"] for x in self._labs_of(p)]} for p in teaching]}
        related = self.match_researchers(f"{c['course_title']}. {c['description']}", k=k)
        return {"course_id": course_id, "type": "related researchers (topic)",
                "researchers": [{"professor": r["professor"], "labs": [x["name"] for x in r["labs"]], "why": r["why"]}
                                for r in related]}

    def _labs_of(self, prof):
        p = next((x for x in self.profiles if x["professor"] == prof), None)
        return [{"name": l, "link": self.d.lab_link(l)} for l in (p["labs"] if p else [])]

    def prep_courses(self, query: str, level: str | None = None, k: int = 3, exclude=()) -> list[dict]:
        """Spring 2027 electives whose catalog text matches the research topic, filtered by level."""
        qv = self.cvec.transform([query_text(query)])
        sims = (self.C @ qv.T).toarray().ravel()
        top = sims.max() or 1
        out = []
        for i in np.argsort(-sims):
            r = self.cdf.iloc[i]
            n = course_num(r["course_id"])
            if sims[i] / top < 0.25 or len(out) >= k:
                break
            if not r["elective"] or r["course_id"] in exclude:
                continue
            if level == "Undergraduate" and n >= 500 or level in ("Master's", "PhD") and n < 400:
                continue
            if level != "PhD" and "Doctoral" in r.get("course_restrictions", "") and "Master" not in r.get("course_restrictions", ""):
                continue
            out.append({"course_id": r["course_id"], "course_title": r["course_title"],
                        "prerequisites": r.get("prerequisites", ""), "recommended_prep": r.get("recommended_prep", ""),
                        "taught_by_researcher": self.d.course_profs.get(r["course_id"], []),
                        "fit": round(float(sims[i] / top), 2), "source_url": r.get("source_url", "")})
        return out
