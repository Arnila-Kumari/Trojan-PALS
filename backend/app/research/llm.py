"""Optional LLM layer. Everything works without it.

Turn on with env vars:  PALS_LLM=anthropic  ANTHROPIC_API_KEY=...  (PALS_LLM_MODEL optional)
                   or:  PALS_LLM=openai     OPENAI_API_KEY=...     PALS_LLM_MODEL=<model>
If your team already has an LLM client, call set_client(fn) with fn(system, user) -> str instead.

Used for:
  explain_research(match)  -> plain-English 2-3 sentence summary, ONLY from the papers/themes given
  polish_email(...)        -> tone polish, rejected if it drops the citation or adds claims
Any failure returns None and the caller keeps its template text.
"""

import os
import re

_client = None
DEFAULT_MODEL = {"anthropic": "claude-sonnet-5-5"}


def set_client(fn):
    """fn(system: str, user: str) -> str. Use your team's existing LLM wrapper."""
    global _client
    _client = fn


def _call(system: str, user: str) -> str | None:
    try:
        if _client:
            return _client(system, user)
        prov = os.getenv("PALS_LLM", "none")
        model = os.getenv("PALS_LLM_MODEL") or DEFAULT_MODEL.get(prov, "")
        if prov == "anthropic" and os.getenv("ANTHROPIC_API_KEY") and model:
            import anthropic
            m = anthropic.Anthropic(timeout=30).messages.create(model=model, max_tokens=500, temperature=0.2,
                                                                system=system, messages=[{"role": "user", "content": user}])
            return "".join(b.text for b in m.content if getattr(b, "type", "") == "text")
        if prov == "openai" and os.getenv("OPENAI_API_KEY") and model:
            from openai import OpenAI
            r = OpenAI(timeout=30).chat.completions.create(model=model, max_tokens=500, temperature=0.2,
                                                           messages=[{"role": "system", "content": system},
                                                                     {"role": "user", "content": user}])
            return r.choices[0].message.content
    except Exception:  # noqa: BLE001  never break the app because of the model
        return None
    return None


EXPLAIN_SYSTEM = ("You explain a USC professor's research to a student new to research. Use ONLY the facts given. "
                  "Do not add projects, funding, openings, or claims not in the text. 2-3 short sentences, no jargon. "
                  "If the facts are thin, say what is known and stop.")

POLISH_SYSTEM = ("Lightly polish this student's email to a professor for tone and flow. Keep every fact exactly. "
                 "Do not add skills, experience, achievements or paper details. Under 150 words. Return only the email.")


def explain_research(match: dict) -> str | None:
    facts = [f"Professor: {match['professor']} ({match['department']})", f"USC research areas: {match['areas']}"]
    facts += [f"Lab/center: {l['name']}" for l in match.get("labs", [])]
    facts += [f"Paper ({p.get('year', '')}): {p['paper_title']}. {p.get('abstract') or p.get('summary', '')}" for p in match.get("papers", [])]
    facts += [f"Teaches: {c['course_id']} {c['course_title']}" for c in match.get("courses_taught", [])]
    return _call(EXPLAIN_SYSTEM, "\n".join(facts))


def polish_email(body: str, cited: str = "", background: str = "") -> str | None:
    out = _call(POLISH_SYSTEM, body)
    if not out:
        return None
    out = out.strip()
    n = len(out.split())
    if n > 190 or n < 40 or (cited and cited not in out):
        return None
    if set(re.findall(r"\d+", out)) - set(re.findall(r"\d+", body)):
        return None
    risky = r"\b(published|publication|award|internship at|years of experience|proficient|expert|PhD in|GPA)\b"
    if re.search(risky, out, re.I) and not re.search(risky, body + background, re.I):
        return None
    return out
