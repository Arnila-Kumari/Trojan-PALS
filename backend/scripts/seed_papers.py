"""
Lab Route: seed papers.csv and prof_topics.csv from OpenAlex.

Input : faculty_seed.csv with columns
          professor, department, lab_name, lab_link, openalex_id (optional)
        You fill this by hand from USC department/lab pages. The script never
        adds a professor that is not in this file.

Output: papers.csv       professor, openalex_id, paper_title, year, link,
                         summary, topics, source_link, date_checked, status
        prof_topics.csv  professor, department, lab_name, lab_link, openalex_id,
                         topics, works_count, source_link, date_checked, status,
                         note
        review.csv       anything that needs a human look before the demo

Usage (from backend/):  python scripts/seed_papers.py --email you@usc.edu
Reads  data/research/research_mentors.csv, writes data/research/papers.csv (+ review.csv).
Restart uvicorn afterwards: the research matcher picks up papers.csv automatically.

Status values
  OK            exactly one USC author matched the name (or you gave an ID)
  REVIEW        several USC author records matched; the one with most works was
                used and the others are listed in review.csv. Check it.
  NOT_FOUND     no USC author matched. Nothing is written for this professor
                except a review.csv row. Add openalex_id by hand to fix.
  NO_RECENT     author found but no papers since --since
"""

import argparse
import csv
import os
import datetime as dt
import sys
import time
import unicodedata

import requests

API = "https://api.openalex.org"
USC_ROR = "https://ror.org/03taz7m60"
USC_FALLBACK_ID = "I1174212"


# ---------- helpers ----------

def norm(name: str) -> str:
    """lowercase, strip accents and punctuation, drop middle initials."""
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = "".join(c if c.isalnum() or c.isspace() else " " for c in s.lower())
    parts = [p for p in s.split() if len(p) > 1]
    return " ".join([parts[0], parts[-1]]) if len(parts) >= 2 else " ".join(parts)


def abstract_from_index(inv) -> str:
    """OpenAlex stores abstracts as {word: [positions]}. Rebuild the text."""
    if not inv:
        return ""
    pos = {}
    for word, idxs in inv.items():
        for i in idxs:
            pos[i] = word
    return " ".join(pos[i] for i in sorted(pos))


def first_sentences(text: str, max_chars: int = 300) -> str:
    """1-line summary = opening of the abstract, cut at a sentence end."""
    text = " ".join(text.split())
    if len(text) <= max_chars:
        return text
    cut = text[:max_chars]
    end = cut.rfind(". ")
    return cut[: end + 1] if end > 80 else cut.rstrip() + "..."


class RateLimited(RuntimeError):
    pass


class OpenAlex:
    def __init__(self, email: str, delay: float = 0.6):
        self.s = requests.Session()
        self.s.headers["User-Agent"] = f"LabRoute-hackathon (mailto:{email})"
        self.email = email
        self.delay = delay

    api_key = ""

    def get(self, path: str, params=None):
        params = dict(params or {})
        params["mailto"] = self.email
        if self.api_key:
            params["api_key"] = self.api_key
        for attempt in range(6):
            r = self.s.get(f"{API}{path}", params=params, timeout=30)
            if r.status_code == 429 or r.status_code >= 500:
                wait = float(r.headers.get("Retry-After") or 0) or min(60, 3 * 2 ** attempt)
                if wait > 120:   # a long Retry-After means the daily quota is used up: stop, don't sleep for hours
                    raise RateLimited(f"OpenAlex daily limit reached (it asked to wait {wait / 3600:.1f} hours). "
                                      "Get a free API key at openalex.org and re-run with --api-key YOUR_KEY")
                print(f"    (OpenAlex busy: HTTP {r.status_code}, waiting {wait:.0f}s)")
                time.sleep(wait)
                continue
            if r.status_code in (401, 403):
                sys.exit(f"OpenAlex returned {r.status_code}. If the message mentions an API key, get a free one at "
                         "openalex.org and run with --api-key. Stopping.")
            r.raise_for_status()
            time.sleep(self.delay)
            return r.json()
        raise RateLimited(f"still rate-limited after retries ({path})")


# ---------- core steps ----------

def usc_institution_id(oa: OpenAlex) -> str:
    try:
        inst = oa.get(f"/institutions/ror:{USC_ROR.split('/')[-1]}")
        iid = inst["id"].rsplit("/", 1)[-1]
        print(f"Institution: {inst['display_name']} ({iid})")
        return iid
    except Exception as e:  # noqa: BLE001
        print(f"Could not resolve USC via ROR ({e}); using {USC_FALLBACK_ID}")
        return USC_FALLBACK_ID


NICKNAMES = {"bill": "william", "will": "william", "bob": "robert", "rob": "robert", "mike": "michael", "jim": "james",
             "tom": "thomas", "ed": "edward", "dan": "daniel", "chris": "christopher", "alex": "alexander",
             "sam": "samuel", "ben": "benjamin", "joe": "joseph", "dave": "david", "andy": "andrew",
             "matt": "matthew", "tony": "anthony", "rick": "richard", "steve": "steven", "nick": "nicholas",
             "greg": "gregory", "jeff": "jeffrey", "kate": "katherine", "liz": "elizabeth", "sandy": "sandra"}


def _first_ok(mine: str, theirs: str) -> bool:
    """Same first initial, or a known nickname pair (Bill/William)."""
    a, b = NICKNAMES.get(mine, mine), NICKNAMES.get(theirs, theirs)
    return a[:1] == b[:1] or a == b


def _search(oa, query, inst_id):
    # lineage = USC plus its sub-institutes (ISI, ICT, ...), which OpenAlex lists separately
    return oa.get("/authors", {
        "search": query,
        "filter": f"affiliations.institution.lineage:{inst_id}",
        "per_page": 25,
        "select": "id,display_name,display_name_alternatives,works_count,topics",
    }).get("results", [])


def resolve_author(oa: OpenAlex, name: str, inst_id: str):
    """Return (chosen_author or None, status, other_candidates).
    Pass 1: full name. Pass 2 (fallback): last name, keep authors with the same first initial
    (Bill/William, Saty/Sathyanarayana style variants). Pass-2 hits are always REVIEW."""
    target = norm(name)
    hits = [a for a in _search(oa, name, inst_id)
            if any(norm(n) == target for n in [a.get("display_name", "")] + (a.get("display_name_alternatives") or []))]
    status = "OK"
    if not hits:
        parts = target.split()
        if len(parts) >= 2:
            first, last = parts[0], parts[-1]
            for a in _search(oa, last, inst_id):
                names = [norm(n) for n in [a.get("display_name", "")] + (a.get("display_name_alternatives") or [])]
                if any(n.split()[-1:] == [last] and _first_ok(first, n.split()[0]) for n in names if n):
                    hits.append(a)
            status = "REVIEW"
    if not hits:
        return None, "NOT_FOUND", []
    hits.sort(key=lambda a: a.get("works_count", 0), reverse=True)
    if len(hits) > 1:
        status = "REVIEW"
    return hits[0], status, hits[1:]


def author_by_id(oa: OpenAlex, aid: str):
    return oa.get(f"/authors/{aid}", {
        "select": "id,display_name,works_count,topics"})


def recent_works(oa: OpenAlex, author_id: str, since: str, n: int):
    data = oa.get("/works", {
        "filter": f"author.id:{author_id},from_publication_date:{since},is_paratext:false",
        "sort": "publication_date:desc",
        "per_page": 25,
        "select": "id,doi,display_name,publication_year,abstract_inverted_index,"
                  "primary_location,topics,type",
    })
    works = [w for w in data.get("results", []) if w.get("display_name")]
    # Prefer papers that have an abstract: retrieval needs text to embed.
    works.sort(key=lambda w: (w.get("abstract_inverted_index") is None,))
    return works[:n]


def work_link(w) -> str:
    if w.get("doi"):
        return w["doi"]
    loc = w.get("primary_location") or {}
    return loc.get("landing_page_url") or w["id"]


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--email", required=True, help="for OpenAlex polite pool")
    ap.add_argument("--seed", default="data/research/research_mentors.csv")
    ap.add_argument("--since", default="2023-01-01")
    ap.add_argument("--per-prof", type=int, default=3)
    ap.add_argument("--api-key", default="", help="only if OpenAlex asks for one")
    ap.add_argument("--out-dir", default="data/research")
    ap.add_argument("--refresh", action="store_true", help="ignore saved results and fetch everyone again")
    args = ap.parse_args()

    today = dt.date.today().isoformat()
    oa = OpenAlex(args.email)
    oa.api_key = args.api_key
    inst = usc_institution_id(oa)

    with open(args.seed, newline="", encoding="utf-8") as f:
        seeds = [r for r in csv.DictReader(f) if r.get("professor", "").strip()]
    os.makedirs(args.out_dir, exist_ok=True)
    print(f"{len(seeds)} professors in {args.seed}\n")


    # resume: keep professors already saved by an earlier (possibly interrupted) run
    def _load(name):
        path = os.path.join(args.out_dir, name)
        if args.refresh or not os.path.exists(path):
            return []
        with open(path, newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))
    profs = _load("prof_topics.csv")
    done = {r["professor"] for r in profs}
    papers = [r for r in _load("papers.csv") if r["professor"] in done]
    review = [r for r in _load("review.csv") if r["professor"] in done]
    if done:
        print(f"Resuming: {len(done)} professors already saved, fetching the rest. Use --refresh to start over.\n")
    stopped = ""
    try:
        for row in seeds:
            if row["professor"].strip() in done:
                continue
            name = row["professor"].strip()
            given_id = (row.get("openalex_id") or "").strip()
            if given_id:
                author, status, others = author_by_id(oa, given_id), "OK", []
            else:
                author, status, others = resolve_author(oa, name, inst)

            if author is None:
                print(f"  NOT_FOUND  {name}")
                review.append({"professor": name, "status": "NOT_FOUND",
                               "detail": "No USC-affiliated OpenAlex author matched. "
                                         "Find the ID on openalex.org and add openalex_id."})
                continue

            aid = author["id"].rsplit("/", 1)[-1]
            author_url = f"https://openalex.org/{aid}"
            topics = "; ".join(t["display_name"] for t in (author.get("topics") or [])[:5])

            if status == "REVIEW":
                review.append({"professor": name, "status": "REVIEW",
                               "detail": f"Used {aid} = '{author.get('display_name')}' ({author.get('works_count')} works). "
                                         "Other candidates: " + ", ".join(
                                             f"{o['id'].rsplit('/', 1)[-1]} ({o.get('works_count')} works)"
                                             for o in others)})

            works = recent_works(oa, aid, args.since, args.per_prof)
            note = ""
            if not works:
                status = "NO_RECENT" if status == "OK" else status
                note = f"no papers since {args.since}"
                review.append({"professor": name, "status": "NO_RECENT", "detail": note})

            for w in works:
                abstract = abstract_from_index(w.get("abstract_inverted_index"))
                papers.append({
                    "professor": name,
                    "openalex_id": aid,
                    "paper_title": w["display_name"],
                    "year": w.get("publication_year", ""),
                    "link": work_link(w),
                    "summary": first_sentences(abstract) if abstract else "No abstract in OpenAlex",
                    "abstract": abstract,
                    "topics": "; ".join(t["display_name"] for t in (w.get("topics") or [])[:3]),
                    "source_link": w["id"],
                    "date_checked": today,
                    "status": status,
                })

            profs.append({
                "professor": name,
                "department": row.get("department", ""),
                "areas": row.get("areas", ""),
                "lab_name": row.get("lab_name", ""),
                "lab_link": row.get("lab_link", ""),
                "openalex_id": aid,
                "topics": topics,
                "works_count": author.get("works_count", ""),
                "source_link": author_url,
                "date_checked": today,
                "status": status,
                "note": note,
            })
            print(f"  {status:<10} {name}: {len(works)} papers")

    except RateLimited as e:
        stopped = str(e)
    except KeyboardInterrupt:
        stopped = "stopped by you (Ctrl+C)"

    def dump(fname, rows, cols):
        path = f"{args.out_dir}/{fname}"
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=cols)
            w.writeheader()
            w.writerows(rows)
        print(f"wrote {path} ({len(rows)} rows)")

    print()
    dump("papers.csv", papers, ["professor", "openalex_id", "paper_title", "year", "link",
                                "summary", "abstract", "topics", "source_link",
                                "date_checked", "status"])
    dump("prof_topics.csv", profs, ["professor", "department", "areas", "lab_name", "lab_link",
                                    "openalex_id", "topics", "works_count", "source_link",
                                    "date_checked", "status", "note"])
    dump("review.csv", review, ["professor", "status", "detail"])
    if review:
        print(f"\n{len(review)} professor(s) need a look. Open review.csv before the demo.")
    if stopped:
        print(f"\nPaused early: {stopped}. Progress is saved; run the same command again to continue.")


if __name__ == "__main__":
    main()
