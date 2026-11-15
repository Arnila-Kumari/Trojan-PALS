from app.data_loader import build_catalog, load_courses, load_reviews
from app.models import StudentPreferences
from app.recommender import recommend


def test_real_catalog_and_no_unverified_review_leak():
    catalog = build_catalog()
    assert len(catalog) >= 88
    db = next(c for c in catalog if c['course_id'] == 'CSCI-585')
    assert db['instructor'] is None
    assert db['review_count'] == 0


def test_professor_specific_and_historical_semester_matching():
    courses = [{'course_id':'CSCI-585','course_title':'Database Systems','description':'Database SQL','topics':'databases','term':'Spring 2027'}]
    offers = [
        {'course_id':'CSCI-585','term':'Spring 2027','section_id':'1','instructor_name':'Saty','assignment_status':'VERIFIED'},
        {'course_id':'CSCI-585','term':'Spring 2027','section_id':'2','instructor_name':'Other Professor','assignment_status':'VERIFIED'},
    ]
    reviews = [
        {'course_id':'CSCI-585','instructor':'Saty','semester':'Spring 2026','difficulty_1_5':'2','assessment_style':'Exam and homework based','workload_level':'Very light','midterms_count':'1','final_exam':'1','homework_count':'4','projects_count':'0'},
        {'course_id':'CSCI-585','instructor':'Other Professor','semester':'Fall 2025','difficulty_1_5':'4','assessment_style':'Projects','workload_level':'High','midterms_count':'0','final_exam':'0','homework_count':'3','projects_count':'2'},
    ]
    catalog = build_catalog(courses,offers,reviews)
    assert [c['review_count'] for c in catalog] == [1,1]
    response = recommend(StudentPreferences(interests=['databases'],top_k=2),catalog=catalog,semantic_scores=[.8])
    by_prof = {r.instructor:r for r in response.recommendations}
    assert by_prof['Saty'].difficulty == 2
    assert by_prof['Other Professor'].difficulty == 4
    assert by_prof['Saty'].reviews[0]['semester'] == 'Spring 2026'


def test_no_reviews_still_recommended_without_fake_difficulty():
    catalog = build_catalog()
    response = recommend(StudentPreferences(interests=['algorithms'],top_k=20),catalog=catalog,
                         semantic_scores=[.5]*len(set(' | '.join(str(c.get(k) or '') for k in ('course_title','description','topics')) for c in catalog)))
    assert response.recommendations
    assert all(r.difficulty is None for r in response.recommendations)
    assert all(r.review_count == 0 for r in response.recommendations)


def test_unknown_offering_cannot_inherit_historical_review():
    courses = [{'course_id':'CSCI-585','course_title':'Database Systems','term':'Spring 2027'}]
    offers = [{'course_id':'CSCI-585','instructor_name':'Saty','assignment_status':'NOT_VERIFIED'}]
    reviews = [{'course_id':'CSCI-585','instructor':'Saty','semester':'Spring 2026'}]
    assert build_catalog(courses,offers,reviews)[0]['review_count'] == 0
