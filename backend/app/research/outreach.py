"""Outreach email from a fixed template: only sourced facts + the student's own words.
Optional LLM tone polish is applied only if it passes the guards (see llm.polish_email)."""

from . import llm


def draft_email(student: dict, match: dict) -> dict:
    name = student.get("name") or "[Your name]"
    level = student.get("level") or "[your program]"
    interests = (student.get("interests") or "[your research interest]").strip().rstrip(".")
    ev = match.get("evidence") or {}
    if ev.get("kind") == "paper":
        hook = f"I read your paper \"{ev['label']}\" and would like to learn more about this direction."
    elif ev.get("kind") == "lab":
        hook = f"I saw that you are part of {ev['label']}, and its focus connects closely to what I want to work on."
    elif ev.get("kind") == "course":
        hook = f"I noticed you teach {ev['label']}, and the topics connect closely to what I want to work on."
    else:
        hook = "Your research area connects closely to what I want to work on."
    bg = (student.get("background") or "").strip().rstrip(".")
    body = (f"Dear Professor {match['professor'].split()[-1]},\n\n"
            f"My name is {name}, a {level} student at USC. I am interested in {interests}. {hook}"
            + (f"\n\nA bit about me: {bg}." if bg else "") +
            "\n\nWould you be open to a short meeting, or could you point me to the best way for a student to get "
            f"involved with your group, for example through directed research?\n\nThank you for your time,\n{name}")
    out = {"subject": f"USC student interested in {interests[:60]}", "body": body, "polished": False,
           "cites": ev.get("label", ""),
           "note": "" if ev.get("kind") == "paper" else "No paper loaded for this professor, so the email cites a lab or course."}
    polished = llm.polish_email(body, cited=ev.get("label", ""), background=bg)
    if polished:
        out.update(body=polished, polished=True)
    return out
