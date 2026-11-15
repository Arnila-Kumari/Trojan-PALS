from app.skill_gap_analyzer import generate_skill_gap_analysis

PAPER = {"paper_title":"Example Research", "abstract":"We evaluate transformer architectures on dialogue datasets.", "link":"https://example.org/paper", "status":"OK"}

def fake_generate(prompt, system_prompt):
    return '{"methods":[{"skill":"transformer architectures","paper_title":"Example Research","evidence_quote":"transformer architectures"}]}'

def test_grounded_extraction_and_completed_course_filter():
    result = generate_skill_gap_analysis(
        {"skills":["Python"], "completed_courses":["CSCI-544"]},
        {"professor":"Example Professor", "papers":[PAPER]},
        [{"course_id":"CSCI-544", "course_title":"Transformer architectures"},
         {"course_id":"CSCI-644", "course_title":"Transformer architectures and dialogue"}], fake_generate)
    assert result["suggested_preparation"][0]["courses"][0]["course_id"] == "CSCI-644"
    assert all(c["course_id"] != "CSCI-544" for c in result["suggested_preparation"][0]["courses"])

def test_rejects_hallucinated_quote():
    result = generate_skill_gap_analysis({}, {"papers":[PAPER]}, [],
        lambda p,s: '{"methods":[{"skill":"quantum computing","paper_title":"Example Research","evidence_quote":"quantum computing"}]}')
    assert result["suggested_preparation"] == []

def test_no_papers_no_claimed_gaps():
    result = generate_skill_gap_analysis({"skills":["Python"]}, {"papers":[]}, [], fake_generate)
    assert result["evidence_level"] == "insufficient_paper_evidence"
    assert not result["suggested_preparation"]
