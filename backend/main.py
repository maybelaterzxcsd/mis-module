from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from model import model_instance

app = FastAPI(
    title="MedMind AI Routing API",
    description="API для AI-анализа медицинских заключений (совместимо с БФТ НПКЦ ДиТ ДЗМ)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
    pathology_flag: bool       # Наличие патологии (true/false)
    confidence_level: int      # Уверенность модели в диапазоне 0-100
    report: str                # Раздел "Описание" DICOM SR
    conclusion: str            # Раздел "Заключение" DICOM SR
    
    next_steps: Optional[List[str]] = []
    questions_for_doctor: Optional[List[str]] = []
    
    model_used: str = "medmind-rubert-v2"

class DripRequest(BaseModel):
    patient_id: str
    day: int 

MOCK_PATIENTS = {
    "1": "Мария Петровна",
    "2": "Иван Сергеевич",
    "3": "Анна Владимировна",
    "4": "Дмитрий Андреевич"
}

DRIP_MESSAGES = {
    1: "Здравствуйте, {name}! 👋 Напоминаем, что по вашему заключению рекомендуется консультация врача. Не откладывайте здоровье на потом. Нажмите /start в боте, чтобы записаться.",
    3: "Уважаемый(ая) {name}, мы видим, что вы еще не записались на прием. Это важно для вашего здоровья. Пожалуйста, свяжитесь с нами или нажмите /start в боте.",
    7: "❗ {name}, ваше здоровье в зоне риска. Вы не записались на прием уже 7 дней. Пожалуйста, ответьте на это сообщение или позвоните нам: +7 (495) 123-45-67."
}

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

MOCK_BFT_DATA = {
    "mammography": {
        "report": "Маммографическая плотность ткани молочной железы по ACR: тип B. Кальцинаты: не выявлены. Образования: в верхне-наружном квадранте правой молочной железы определяется образование с неровными контурами размером 15 мм. Нарушение архитектоники ткани: не выявлено. Аксиллярные лимфоузлы: не увеличены.",
        "conclusion": "BI-RADS 4 правой молочной железы. Рекомендована срочная консультация онколога-маммолога для решения вопроса о пункционной биопсии."
    },
    "ct_lungs": {
        "report": "В S6 правого легкого определяется солидный узел размером 8 мм с ровными, четкими контурами. Легочный рисунок не деформирован. Плевральные полости свободны. Средостение не смещено.",
        "conclusion": "Солидный узел S6 правого легкого. Рекомендована консультация пульмонолога и динамическое КТ-наблюдение через 3 месяца."
    },
    "xray": {
        "report": "Прозрачность легочных полей снижена за счет инфильтративных изменений в нижней доле правого легкого. Легочный рисунок усилен в нижних отделах. Корни легких не расширены, структурны. Диафрагма: контуры четкие. Плевральные синусы свободны. Тень сердца не расширена.",
        "conclusion": "Рентгенологическая картина очаговой пневмонии в нижней доле правого легкого. Рекомендована срочная консультация терапевта."
    }
}

MOCK_KILLER_FEATURES = {
    "mammography": {
        "next_steps": [
            "Завтра, 10:00 — Первичная консультация онколога-маммолога",
            "Через 2 недели — Биопсия образования (направление будет отправлено)",
            "Через 3 месяца — Контрольное УЗИ для оценки динамики"
        ],
        "questions_for_doctor": [
            "Нужна ли мне биопсия при текущем размере образования (15 мм)?",
            "Можно ли мне продолжать принимать мои текущие лекарства?",
            "Какие симптомы должны заставить меня вызвать скорую до следующего приема?"
        ]
    },
    "ct_lungs": {
        "next_steps": [
            "Через неделю — Консультация пульмонолога",
            "Через 3 месяца — Повторное КТ для контроля динамики узла",
            "Через 6 месяцев — Плановый осмотр терапевта"
        ],
        "questions_for_doctor": [
            "Какова вероятность, что узел доброкачественный?",
            "Нужны ли мне дополнительные анализы крови?",
            "Можно ли мне заниматься спортом при таком диагнозе?"
        ]
    },
    "xray": {
        "next_steps": [
            "Сегодня, 16:00 — Срочный прием терапевта",
            "Через 3 дня — Контрольный рентген после начала лечения",
            "Через 2 недели — Повторная консультация для оценки выздоровления"
        ],
        "questions_for_doctor": [
            "Нужны ли мне антибиотики или можно обойтись без них?",
            "Как долго мне придется находиться на больничном?",
            "Какие симптомы должны заставить меня вызвать скорую?"
        ]
    }
}

def detect_conclusion_type(text: str) -> str:
    """Определяет тип заключения по ключевым словам"""
    text_lower = text.lower()
    for ctype, rules in ROUTING_RULES.items():
        if any(kw in text_lower for kw in rules["keywords"]):
            return ctype
    return "mammography" 

@app.get("/")
async def root():
    return {"message": "MedMind AI Routing API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model_loaded": model_instance.model is not None,
        "device": str(model_instance.device)
    }

@app.post("/api/analyze", response_model=RoutingResponse)
async def analyze_conclusion(request: ConclusionRequest):
    try:
        conclusion_type = detect_conclusion_type(request.text)
        
        urgency_result = model_instance.predict_urgency(request.text)
        urgency = urgency_result["urgency"]
        confidence = urgency_result["confidence"]
        
        if confidence < 0.5:
            text_lower = request.text.lower()
            if any(word in text_lower for word in ["bi-rads 4", "bi-rads 5", "злокачеств", "карцином"]):
                urgency = "red"
            elif any(word in text_lower for word in ["узел", "образование", "подозрен"]):
                urgency = "yellow"
            else:
                urgency = "green"
        
        rules = ROUTING_RULES[conclusion_type]
        bft_data = MOCK_BFT_DATA.get(conclusion_type, MOCK_BFT_DATA["mammography"])
        killer_data = MOCK_KILLER_FEATURES.get(conclusion_type, MOCK_KILLER_FEATURES["mammography"])
        
        return RoutingResponse(
            patient_id=request.patient_id,
            patient_name=request.patient_name,
            type=conclusion_type,
            urgency=urgency,
            specialist=rules["specialist"],
            timeframe=rules["timeframes"][urgency],
            red_flags=rules["red_flags"],
            ai_confidence=confidence,
            model_used="medmind-rubert-v2",
            pathology_flag=(urgency != "green"),
            confidence_level=int(confidence * 100),
            report=bft_data["report"],
            conclusion=bft_data["conclusion"],
            next_steps=killer_data["next_steps"],
            questions_for_doctor=killer_data["questions_for_doctor"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-batch")
async def analyze_batch(texts: List[str]):
    results = []
    for text in texts:
        result = model_instance.predict_urgency(text)
        results.append(result)
    return results

@app.post("/api/drip-campaign")
async def send_drip_message(request: DripRequest):
    name = MOCK_PATIENTS.get(request.patient_id, "Пациент")
    text = DRIP_MESSAGES.get(request.day, DRIP_MESSAGES[1]).format(name=name)
    
    return {
        "status": "success",
        "patient_id": request.patient_id,
        "patient_name": name,
        "day": request.day,
        "message_sent": text,
        "info": f"Сообщение для дня {request.day} сгенерировано и поставлено в очередь отправки для patient_{request.patient_id}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)