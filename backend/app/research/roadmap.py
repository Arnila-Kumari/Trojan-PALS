"""Item 1: a streamlined research roadmap the student can follow step by step.

build_roadmap(query, student, matches, matcher) ->
{
  "target":  {professor, why, evidence},            # who to aim for first
  "backup_targets": [professor, ...],               # next 2 to try
  "stages": [ {"id", "title", "when", "goal", "steps": [ {"action", "detail", "link", "source"} ]} ],
  "checklist": ["...", ...],                        # flat list for a progress tracker
  "notes": ["what we could not verify ..."]
}

Rules: every step names a real course, link or data point we hold; nothing invented.
Level-aware: Undergraduate -> CSCI 490 (catalog: juniors/seniors), Master's -> CSCI/DSCI 590, PhD -> CSCI 790 with advisor.
"""

from .matcher import Matcher, level_in
from .outreach import draft_email

CS_OPENINGS = "https://www.cs.usc.edu/newsletter-category/job-research-opportunities/"


def _step(action, detail="", link="", source=""):
    return {"action": action, "detail": detail, "link": link, "source": source}


def _course_line(m: Matcher, cid: str) -> tuple[str, str, str]:
    c = m.d.course(cid) or {}
    off = m.d.offerings[m.d.offerings["course_id"] == cid]
    dclear = (not off.empty) and str(off.get("d_clearance_any_section", ["false"]).iloc[0] if "d_clearance_any_section" in off else "false").lower() == "true"
    units = c.get("units", "?")
    detail = f"{units} unit{'' if units == '1' else 's'}" + ("; needs D-clearance" if dclear else "")
    if c.get("course_restrictions"):
        detail += f"; restrictions: {c['course_restrictions']}"
    return f"{cid} {c.get('course_title', '')}", detail, c.get("source_url", "")


def build_roadmap(query: str, student: dict, matches: list[dict], matcher: Matcher) -> dict:
    if not matches:
        return {"target": None, "backup_targets": [], "stages": [], "checklist": [],
                "notes": ["No matching researchers yet. Try naming a topic (e.g. NLP, robotics, security)."]}
    student = student or {}
    level = student.get("level_code") or level_in(student.get("level", "")) or level_in(query) or "Master's"
    program = (student.get("program") or student.get("level") or "").upper()
    t, backups = matches[0], matches[1:3]
    ev = t.get("evidence") or {}
    notes = []

    # ---- Stage 1: Explore
    s1 = []
    if ev.get("kind") == "paper":
        s1.append(_step(f"Read \"{ev['label']}\"", "Note 2 questions you'd ask about it.", ev.get("link"), "papers.csv (OpenAlex)"))
    elif ev.get("kind") == "lab":
        s1.append(_step(f"Explore {ev['label']}", f"Theme to focus on: {ev['theme']}." if ev.get("theme") else
                        "Read the research and people pages.", ev.get("link"), "USC lab/center page"))
    elif ev.get("kind") == "course":
        s1.append(_step(f"Read the description of {ev['label']}", "It shows what this researcher teaches and cares about.",
                        ev.get("link"), "USC Schedule of Classes"))
    for p in t.get("papers", [])[1:3]:
        s1.append(_step(f"Skim \"{p['paper_title']}\"", f"{p.get('year', '')}", p.get("link", ""), "papers.csv"))
    if not t.get("papers"):
        s1.append(_step(f"Find 1 to 2 recent papers by {t['professor']}", "Use their profile or lab site; we haven't loaded papers yet.",
                        t.get("profile_url", ""), "faculty profile"))
        notes.append("Papers not loaded: run seed_papers.py so step 1 can cite a specific paper.")
    sh = t.get("students_shared", {})
    if sh.get("n"):
        top_way = max(sh["how_got_in"], key=sh["how_got_in"].get)
        s1.append(_step("See how other students got in", f"{sh['n']} student(s) shared; most common: {top_way.lower()}.",
                        "", "opt-in lab experiences"))

    # ---- Stage 2: Build the background (registration)
    s2 = []
    taught = [c["course_id"] for c in t.get("courses_taught", [])]
    for cid in taught[:2]:
        label, detail, link = _course_line(matcher, cid)
        s2.append(_step(f"Take {label} with {t['professor']}", detail + ". Direct way to meet the researcher.", link,
                        "Spring 2027 Schedule of Classes"))
    for c in matcher.prep_courses(query, level, k=3, exclude=taught):
        label, detail, link = _course_line(matcher, c["course_id"])
        extra = f"; prerequisites: {c['prerequisites']}" if c["prerequisites"] else ""
        extra += f"; recommended: {c['recommended_prep']}" if c["recommended_prep"] else ""
        who = f" (taught by researcher {', '.join(c['taught_by_researcher'])})" if c["taught_by_researcher"] else ""
        s2.append(_step(f"Consider {label}{who}", detail + extra, link, "Spring 2027 Schedule of Classes"))
    if not s2:
        notes.append("No matching Spring 2027 elective found for this topic at your level.")

    # ---- Stage 3: Reach out
    email = draft_email(student, t)
    s3 = [_step(f"Email {t['professor']}", "Use the draft below; edit it in your own voice. Mention what you read in step 1.",
                t.get("profile_url", ""), "draft generated from sourced facts + your words")]
    if backups:
        s3.append(_step("Also contact " + " and ".join(b["professor"] for b in backups),
                        "Reach out to 2 to 3 researchers at a time, not 10.", "", "match ranking"))
    s3.append(_step("Follow up once after about 10 days", "One short, polite follow-up. Then move to the next name.", "", "general practice"))

    # ---- Stage 4: Get involved
    s4 = []
    if level == "Undergraduate":
        label, detail, link = _course_line(matcher, "CSCI-490")
        s4.append(_step(f"Ask about {label}", detail + ". Register once a professor agrees to supervise you.", link, "Schedule of Classes"))
    elif level == "PhD":
        label, detail, link = _course_line(matcher, "CSCI-790")
        s4.append(_step(f"Discuss {label} with your advisor", detail, link, "Schedule of Classes"))
    else:
        cid = "DSCI-590" if "DSCI" in program or "DATA SCIENCE" in program else "CSCI-590"
        label, detail, link = _course_line(matcher, cid)
        s4.append(_step(f"Ask about {label}", detail + ". Register once a professor agrees to supervise you.", link, "Schedule of Classes"))
    if level != "Undergraduate":
        label, detail, link = _course_line(matcher, "CSCI-591")
        s4.append(_step(f"Join {label}", detail + ". Catalog: a forum for current research presentations; a low-pressure way to hear researchers.", link,
                        "Schedule of Classes"))
    s4.append(_step("Watch for posted openings", "The CS department posts research and job openings here. Check it regularly.",
                    CS_OPENINGS, "USC CS job & research opportunities page"))

    # ---- Stage 5: Keep going
    s5 = [_step("No reply? Try your backup researchers", "Repeat stages 1 to 3 for the next name on your list.", "", "match ranking"),
          _step("Once you're in, share how you got in", "Helps the next student (opt-in, shown only with consent).", "",
                "Trojan PALS lab experience form")]

    stages = [
        {"id": "explore", "title": "1. Explore the research", "when": "This week", "goal": "Know what they work on", "steps": s1},
        {"id": "prepare", "title": "2. Build the background", "when": "Spring 2027 registration", "goal": "Take courses that lead there", "steps": s2},
        {"id": "reach_out", "title": "3. Reach out", "when": "After step 1, early in the semester", "goal": "Get a meeting", "steps": s3},
        {"id": "get_involved", "title": "4. Get involved", "when": "Once a professor says yes", "goal": "Make it official", "steps": s4},
        {"id": "keep_going", "title": "5. Keep going", "when": "Ongoing", "goal": "Don't stall", "steps": s5},
    ]
    return {
        "level": level,
        "target": {"professor": t["professor"], "why": t["why"], "evidence": ev, "department": t["department"]},
        "backup_targets": [b["professor"] for b in backups],
        "stages": stages,
        "checklist": [f"{s['title'].split('. ', 1)[1]}: {st['action']}" for s in stages for st in s["steps"]],
        "email": email,
        "notes": notes + ([] if t.get("papers") else ["Matching is based on USC research areas, lab themes and courses taught."]),
    }
