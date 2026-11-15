from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .data_loader import build_catalog, load_courses, load_reviews
from .models import StudentPreferences, RecommendationResponse
from .recommender import recommend

app = FastAPI(title='Trojan PALS — Course Recommendations', version='0.3.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

@app.get('/')
def root():
    return {'app':'Trojan PALS', 'docs':'/docs', 'health':'/health'}

@app.get('/health')
def health():
    return {'status':'ok'}

@app.get('/courses')
def courses():
    return build_catalog()

@app.get('/reviews')
def reviews():
    return load_reviews()

@app.post('/recommend',response_model=RecommendationResponse)
def recommend_endpoint(preferences: StudentPreferences):
    return recommend(preferences)


from fastapi import HTTPException
from .chat_service import ChatRequest, ChatResponse, chat

@app.post('/chat', response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        return chat(request)
    except (RuntimeError, ValueError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
