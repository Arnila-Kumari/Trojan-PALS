"""Research endpoints + roadmap. Offline: no GROQ_API_KEY needed."""
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.research_api import router
from app.research_engine import course_research, norm_course_id, research_plan



def _client():
    app = FastAPI()
    app.include_router(router)
    return TestClient(app)


Q = "I'm interested in NLP applications in healthcare. How can I get involved?"


def test_match_endpoint_shape():
    r = _client().post("/research/match", json={"query": Q, "student": {"name": "Ari", "level": "Master's in CS",
                                                                        "background": "I built an EEG classifier"}})
    assert r.status_code == 200
    body = r.json()
    assert body["researchers"] and body["roadmap"]["target"]["professor"] == body["researchers"][0]["professor"]
    assert [s["id"] for s in body["roadmap"]["stages"]] == ["explore", "prepare", "reach_out", "get_involved", "keep_going"]
    assert "EEG classifier" in body["roadmap"]["email"]["body"]


def test_roadmap_courses_are_real_spring_2027_courses():
    plan = research_plan(Q, {"level": "Master's in CS"})
    from app.research_engine import engine
    for stage in plan["roadmap"]["stages"]:
        for step in stage["steps"]:
            for tok in step["action"].split():
                if tok[:4] in ("CSCI", "DSCI") and "-" in tok:
                    assert engine().data.course(tok) is not None, tok


def test_level_aware_directed_research():
    ug = research_plan("robotics research", {"level": "Undergraduate"})["roadmap"]
    ms = research_plan("robotics research", {"level": "MS Data Science", "program": "MS Data Science"})["roadmap"]
    assert "CSCI-490" in " ".join(s["action"] for s in ug["stages"][3]["steps"])
    assert "DSCI-590" in " ".join(s["action"] for s in ms["stages"][3]["steps"])


def test_course_badge_endpoint_accepts_any_id_format():
    c = _client()
    for cid in ("CSCI 644", "CSCI644", "csci-644"):
        r = c.get(f"/research/course/{cid}")
        assert r.status_code == 200 and r.json()["type"] == "taught by a researcher"
    assert c.get("/research/course/NOPE 000").status_code == 404
    assert norm_course_id("dsci 552") == "DSCI-552"
    assert course_research("CSCI 544")["type"] == "related researchers (topic)"


def test_prep_endpoint_level_filter():
    r = _client().get("/research/prep", params={"query": "robotics", "level": "Undergraduate"})
    assert r.status_code == 200 and all(int(x["course_id"].split("-")[1][:3]) < 500 for x in r.json())


def test_paper_citations_only_from_loaded_papers():
    from app.research_engine import engine
    plan = research_plan(Q, {})
    titles = set(engine().data.papers["paper_title"]) if len(engine().data.papers) else set()
    for m in plan["researchers"]:
        ev = m["evidence"] or {}
        if ev.get("kind") == "paper":
            assert ev["label"] in titles                     # cited paper must exist in papers.csv
        if not plan["papers_loaded"]:
            assert ev.get("kind") != "paper"                 # never cite a paper we don't have
