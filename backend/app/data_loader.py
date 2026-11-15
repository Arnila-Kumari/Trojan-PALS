"""Separate official course listings, section instructors, and historical reviews."""
import csv
import re
from pathlib import Path
from collections import defaultdict

DATA = Path(__file__).resolve().parents[1] / 'data'


def read_csv(name):
    with (DATA / name).open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def norm_course(value):
    return re.sub(r'\s+', '', (value or '').upper().replace('-', ''))


def norm_prof(value):
    return ' '.join((value or '').lower().replace('.', '').split())


def number(value):
    try:
        return float(value) if str(value).strip() else None
    except (ValueError, TypeError):
        return None


def load_courses():
    return read_csv('courses.csv')


def load_offerings():
    """One row per section; blank instructor means no verified assignment yet."""
    return read_csv('spring2027_offerings.csv')


def load_reviews():
    return read_csv('student_reviews.csv')


def build_catalog(courses=None, offerings=None, reviews=None):
    courses = load_courses() if courses is None else courses
    offerings = load_offerings() if offerings is None else offerings
    reviews = load_reviews() if reviews is None else reviews
    by_course = defaultdict(list)
    for offer in offerings:
        by_course[norm_course(offer.get('course_id'))].append(offer)
    by_pair = defaultdict(list)
    for review in reviews:
        by_pair[(norm_course(review.get('course_id')), norm_prof(review.get('instructor')))].append(review)
    result = []
    for course in courses:
        code = norm_course(course.get('course_id'))
        sections = by_course.get(code) or [{'course_id':course['course_id'], 'term':course.get('term','Spring 2027'), 'instructor_name':'', 'section_id':'', 'assignment_status':'NOT_VERIFIED'}]
        for section in sections:
            prof = (section.get('instructor_name') or '').strip()
            # Never attach a historical review to a section without a verified instructor.
            verified = bool(prof) and (section.get('assignment_status') or '').upper() in ('VERIFIED', 'OFFICIAL_VERIFIED')
            matching = by_pair.get((code, norm_prof(prof)), []) if verified else []
            result.append({**course,
                'instructor':prof if verified else None,
                'section_id':section.get('section_id') or None,
                'instructor_verified':verified,
                'review_count':len(matching),
                'reviews':matching,
                'semester':section.get('term') or course.get('term') or 'Spring 2027',
            })
    return result
