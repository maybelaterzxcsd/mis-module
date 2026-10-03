from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import re
from model import model_instance

app = FastAPI(
    title="MedMind AI Routing API",
    description="API для AI-анализа медицинских заключений",
    version="1.0.0"
)

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === МОДЕЛИ ЗАПРОСОВ/ОТВЕТОВ ===

class ConclusionRequest(BaseModel):
    text: str
    patient_id: str = "1"
    patient_name: Optional[str] = "Пациент"

class RoutingResponse(BaseModel):
    patient_id: str
    patient_name: str
    type: str  # mammography, ct_lungs, xray
    urgency: str  # red, yellow, green
    specialist: str
    timeframe: str
    red_flags: List[str]
    ai_confidence: float
    model_used: str

# === ПРАВИЛА МАРШРУТИЗАЦИИ ===

ROUTING_RULES = {
    "mammography": {
        "keywords": ["bi-rads", "молочн", "маммо", "груди", "соска"],
        "specialist": "онколог-маммолог",
        "timeframes": {"red": "72 часа", "yellow": "2 недели", "green": "1 месяц"},
        "red_flags": ["Увеличение образования", "Выделения из соска", "Изменение кожи груди"]
    },
    "ct_lungs": {
        "keywords": ["кт", "узел", "легк", "s6", "s1", "s2", "компьютерн"],
        "specialist": "пульмонолог",
        "timeframes": {"red": "24 часа", "yellow": "2 недели", "green": "3 месяца"},
        "red_flags": ["Кашель с кровью", "Одышка в покое", "Боль в груди"]
    },
    "xray": {
        "keywords": ["рентген", "пневмон", "инфильтрат", "затемнен", "очаг"],
        "specialist": "терапевт",
        "timeframes": {"red": "24 часа", "yellow": "3 дня", "green": "1 неделя"},
        "red_flags": ["Температура выше 38.5", "Сильная одышка", "Боль при дыхании"]
    }
}

def detect_conclusion_type(text: str) -> str:
    """Определяет тип заключения по ключевым словам"""
    text_lower = text.lower()
    
    for ctype, rules in ROUTING_RULES.items():
        if any(kw in text_lower for kw in rules["keywords"]):
            return ctype
    
    return "mammography"  # по умолчанию

@app.get("/")
async def root():
    return {
        "message": "MedMind AI Routing API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model_loaded": model_instance.model is not None,
        "device": str(model_instance.device)
    }

@app.post("/api/analyze", response_model=RoutingResponse)
async def analyze_conclusion(request: ConclusionRequest):
    """
    Анализирует медицинское заключение и формирует маршрут
    """
    try:
        # 1. Определяем тип заключения по ключевым словам
        conclusion_type = detect_conclusion_type(request.text)
        
        # 2. Анализируем срочность через RuBERT
        urgency_result = model_instance.predict_urgency(request.text)
        urgency = urgency_result["urgency"]
        confidence = urgency_result["confidence"]
        
        # 3. Если модель не дообучена - используем эвристики
        # (можно убрать, когда модель будет обучена)
        if confidence < 0.5:
            # Эвристики по ключевым словам
            text_lower = request.text.lower()
            if any(word in text_lower for word in ["bi-rads 4", "bi-rads 5", "злокачеств", "карцином"]):
                urgency = "red"
            elif any(word in text_lower for word in ["узел", "образование", "подозрен"]):
                urgency = "yellow"
            else:
                urgency = "green"
        
        # 4. Формируем маршрут
        rules = ROUTING_RULES[conclusion_type]
        
        return RoutingResponse(
            patient_id=request.patient_id,
            patient_name=request.patient_name,
            type=conclusion_type,
            urgency=urgency,
            specialist=rules["specialist"],
            timeframe=rules["timeframes"][urgency],
            red_flags=rules["red_flags"],
            ai_confidence=confidence,
            model_used="medmind-rubert-v2"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-batch")
async def analyze_batch(texts: List[str]):
    """Анализирует несколько заключений сразу"""
    results = []
    for text in texts:
        result = model_instance.predict_urgency(text)
        results.append(result)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)