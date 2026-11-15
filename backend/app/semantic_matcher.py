from functools import lru_cache

from sentence_transformers import SentenceTransformer
from sentence_transformers import util


MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_model():
    print("Loading semantic model...")
    return SentenceTransformer(MODEL_NAME)


@lru_cache(maxsize=8)
def get_course_embeddings(course_texts):
    """
    Cache embeddings for a fixed collection of courses.
    course_texts must be a tuple.
    """
    model = get_model()

    print("Encoding course descriptions...")

    return model.encode(
        list(course_texts),
        convert_to_tensor=True,
        normalize_embeddings=True,
        batch_size=32,
        show_progress_bar=False
    )


def calculate_semantic_scores(interests, course_texts):
    if not course_texts:
        return []

    if not interests:
        return [0.0] * len(course_texts)

    model = get_model()

    # Convert to tuple for caching
    course_key = tuple(course_texts)

    # Course embeddings are reused after the first request
    course_embeddings = get_course_embeddings(course_key)

    student_text = (
        "I want to study "
        + ", ".join(interests)
    )

    student_embedding = model.encode(
        student_text,
        convert_to_tensor=True,
        normalize_embeddings=True,
        show_progress_bar=False
    )

    similarities = util.cos_sim(
        student_embedding,
        course_embeddings
    )[0]

    return [
        max(0.0, min(1.0, float(score)))
        for score in similarities
    ]