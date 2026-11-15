"""Load the research + course data once and connect them.

Files in ../data (or a folder you pass to load()):
  courses.csv               Spring 2027 catalog: course_id, course_title, units, description, prerequisites,
                            recommended_prep, course_restrictions, source_url ...
  spring2027_offerings.csv  course_id, instructor_name, assignment_status, d_clearance_any_section, ...
  research_mentors.csv      professor, department, areas, lab_name, lab_link, profile_url, source_link
                            (USC CS research areas & labs page + CCLS faculty page)
  labs.csv                  lab_name, lab_link, areas, faculty, source_link
  instructor_aliases.csv    alias, canonical, status   (schedule/review spellings -> research-page names)
  papers.csv       OPTIONAL professor, paper_title, year, link, summary, abstract  (scripts/seed_papers.py)
  lab_experiences.jsonl OPTIONAL opt-in student experiences (public fields only, never emails)
"""

import csv
import json
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path

import pandas as pd

DEFAULT_DIR = Path(__file__).resolve().parents[2] / "data" / "research"   # backend/data/research: research-only data


def person_key(name) -> str:
    """Accent/case/punctuation-insensitive: 'Maja Matarić' == 'maja mataric', 'Bıyık' == 'biyik'."""
    s = unicodedata.normalize("NFKD", str(name)).encode("ascii", "ignore").decode().lower().replace("ı", "i")
    return " ".join(re.sub(r"[^a-z\s-]", " ", s).split())


def course_num(cid: str) -> int:
    m = re.search(r"(\d{3})", str(cid))
    return int(m.group(1)) if m else 0


@dataclass
class Data:
    courses: pd.DataFrame
    offerings: pd.DataFrame
    faculty: pd.DataFrame
    labs: pd.DataFrame
    papers: pd.DataFrame
    experiences: list
    aliases: dict
    prof_courses: pd.DataFrame = field(default=None)     # professor -> Spring 2027 courses (researchers only)
    course_profs: dict = field(default=None)             # course_id -> [researcher names]

    def lab_link(self, name):
        r = self.labs[self.labs["lab_name"] == name]
        return r["lab_link"].iat[0] if len(r) else ""

    def lab_areas(self, name):
        r = self.labs[self.labs["lab_name"] == name]
        return r["areas"].iat[0] if len(r) else ""

    def lab_about(self, name):
        """Short research description from the lab's own site (optional 'about' column)."""
        if "about" not in self.labs:
            return ""
        r = self.labs[self.labs["lab_name"] == name]
        return str(r["about"].iat[0]) if len(r) and isinstance(r["about"].iat[0], str) else ""

    def course(self, cid):
        r = self.courses[self.courses["course_id"] == cid]
        return r.iloc[0].to_dict() if len(r) else None


CS_WORDS = re.compile(r"learn|neural|language|data|algorithm|network|model|comput|robot|speech|signal|vision|"
                      r"secur|software|graph|optimi|system|intelligen|agent|privacy|program|image|video", re.I)


def _same_person(prof: str, used: str) -> bool:
    """Same last name and same first initial, ignoring accents and middle names."""
    a, b = person_key(prof).split(), person_key(used).split()
    if not (a and b) or a[-1] != b[-1]:
        return False
    f1, f2 = a[0], b[0]
    nick = {"bill": "william", "will": "william", "bob": "robert", "rob": "robert", "jim": "james",
            "mike": "michael", "dave": "david", "tom": "thomas", "saty": "sathyanarayana", "shri": "shrikanth"}
    return (f1 == f2 or len(f1) == 1 or len(f2) == 1 or f1[:3] == f2[:3]
            or nick.get(f1) == f2 or nick.get(f2) == f1
            or f1 in b or f2 in a)   # e.g. 'Shrikanth Shri Narayanan'



def check_papers(papers: pd.DataFrame, review: pd.DataFrame, faculty: pd.DataFrame) -> tuple[pd.DataFrame, list[dict]]:
    """Drop papers whose OpenAlex author is probably not our professor.

    REVIEW rows say which author record was used ("Used A123 = 'Name' (n works)"). We drop a
    professor's papers when (1) that name isn't the same person, or (2) for a computing faculty
    member, none of the papers look like computing research (a namesake in another field)."""
    if papers.empty or review.empty or "detail" not in review:
        return papers, []
    dept = dict(zip(faculty.get("professor", []), faculty.get("department", [])))
    dropped = []
    for r in review[review.get("status", "") == "REVIEW"].itertuples(index=False):
        prof = r.professor
        m = re.search(r"=\s*'([^']+)'", str(r.detail))
        used = m.group(1) if m else ""
        mine = papers[papers["professor"] == prof]
        if mine.empty:
            continue
        reason = ""
        if used and not _same_person(prof, used):
            reason = f"matched a different person: {used}"
        elif any(x in str(dept.get(prof, "")) for x in ("CS", "ECE", "ICT", "ISE")):
            text = " ".join(mine.get("paper_title", "") + " " + mine.get("topics", "") + " " + mine.get("abstract", ""))
            if not CS_WORDS.search(text):
                reason = "papers don't look like computing research (likely a namesake)"
        if reason:
            dropped.append({"professor": prof, "papers": len(mine), "reason": reason})
            papers = papers[papers["professor"] != prof]
    return papers, dropped


def _read(p: Path, required=True) -> pd.DataFrame:
    if not p.exists():
        if required:
            raise FileNotFoundError(p)
        return pd.DataFrame()
    return pd.read_csv(p, dtype=str).fillna("")


def load(folder: str | Path | None = None) -> Data:
    d = Path(folder) if folder else DEFAULT_DIR
    aliases = {}
    if (d / "instructor_aliases.csv").exists():
        with open(d / "instructor_aliases.csv", newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                if r.get("status", "").lower() != "rejected":
                    aliases[person_key(r["alias"])] = r["canonical"].strip()

    papers = _read(d / "papers.csv", required=False)
    if papers.empty:
        papers = pd.DataFrame(columns=["professor", "paper_title", "year", "link", "summary", "abstract"])
    else:   # never show another person's papers: drop uncertain OpenAlex matches that look wrong
        papers, _ = check_papers(papers, _read(d / "review.csv", required=False), _read(d / "research_mentors.csv"))
    exps = []
    if (d / "lab_experiences.jsonl").exists():
        for line in (d / "lab_experiences.jsonl").read_text(encoding="utf-8").splitlines():
            if line.strip():
                r = json.loads(line)
                if r.get("consent_show") is True:
                    r.pop("usc_email", None)
                    exps.append(r)

    data = Data(courses=_read(d / "courses.csv"), offerings=_read(d / "spring2027_offerings.csv"),
                faculty=_read(d / "research_mentors.csv"), labs=_read(d / "labs.csv"),
                papers=papers, experiences=exps, aliases=aliases)
    _link(data)
    return data


def canon(name: str, data: Data) -> str:
    return data.aliases.get(person_key(name), name)


def _link(data: Data):
    """Spring 2027 instructor names -> research-page professors (exact or confirmed alias only)."""
    fac = {person_key(n): n for n in data.faculty["professor"]}
    rows, by_course = [], {}
    for o in data.offerings.itertuples(index=False):
        if not o.instructor_name:
            continue
        prof = fac.get(person_key(canon(o.instructor_name, data)))
        if not prof:
            continue
        c = data.course(o.course_id) or {}
        rows.append({"professor": prof, "course_id": o.course_id, "course_title": c.get("course_title", ""),
                     "source_url": o.source_url})
        by_course.setdefault(o.course_id, [])
        if prof not in by_course[o.course_id]:
            by_course[o.course_id].append(prof)
    data.prof_courses = pd.DataFrame(rows, columns=["professor", "course_id", "course_title", "source_url"]).drop_duplicates()
    data.course_profs = by_course
