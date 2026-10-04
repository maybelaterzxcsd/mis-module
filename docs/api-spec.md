```markdown
# API Specification - MedMind AI Routing Module

Base URL: http://localhost:8000
Swagger UI: http://localhost:8000/docs

---

## 1. POST /api/analyze

Анализирует медицинское заключение и формирует персональный маршрут пациента.

### Request

Content-Type: application/json

```json
{
  "text": "BI-RADS 4, образование 15 мм в правой молочной железе с неровными контурами",
  "patient_id": "1",
  "patient_name": "Иванова Мария Петровна"
}
```

**Поля запроса:**

- **text** (string, обязательное) - Текст заключения (из DICOM SR conclusion)
- **patient_id** (string, опциональное, default: "1") - Внутренний ID пациента
- **patient_name** (string, опциональное, default: "Пациент") - ФИО пациента

### Response

Status: 200 OK

```json
{
  "patient_id": "1",
  "patient_name": "Иванова Мария Петровна",
  "type": "mammography",
  "urgency": "red",
  "specialist": "онколог-маммолог",
  "timeframe": "72 часа",
  "red_flags": [
    "Увеличение образования",
    "Выделения из соска",
    "Изменение кожи груди"
  ],
  "ai_confidence": 0.92,
  "pathology_flag": true,
  "confidence_level": 92,
  "report": "Маммографическая плотность ткани молочной железы по ACR: тип B. Кальцинаты: не выявлены. Образования: в верхне-наружном квадранте правой молочной железы определяется образование с неровными контурами размером 15 мм.",
  "conclusion": "BI-RADS 4 правой молочной железы. Рекомендована срочная консультация онколога-маммолога для решения вопроса о пункционной биопсии.",
  "next_steps": [
    "Завтра, 10:00 - Первичная консультация онколога-маммолога",
    "Через 2 недели - Биопсия образования (направление будет отправлено)",
    "Через 3 месяца - Контрольное УЗИ для оценки динамики"
  ],
  "questions_for_doctor": [
    "Нужна ли мне биопсия при текущем размере образования (15 мм)?",
    "Можно ли мне продолжать принимать мои текущие лекарства?",
    "Какие симптомы должны заставить меня вызвать скорую до следующего приема?"
  ],
  "model_used": "medmind-rubert-v2"
}
```

**Поля ответа:**

- **type** (enum) - mammography | ct_lungs | xray
- **urgency** (enum) - red | yellow | green
- **pathology_flag** (bool) - Наличие патологии (БФТ: pathologyFlag)
- **confidence_level** (int, 0-100) - Уверенность модели в % (БФТ: confidenceLevel)
- **report** (string) - Раздел "Описание" DICOM SR (БФТ: report)
- **conclusion** (string) - Раздел "Заключение" DICOM SR (БФТ: conclusion)
- **next_steps** (string[]) - 3-месячный план наблюдения
- **questions_for_doctor** (string[]) - Вопросы пациента к врачу

**Ошибки:**

- 400 Bad Request - Некорректный запрос (отсутствует text)
- 500 Internal Server Error - Ошибка модели / внутренняя ошибка сервера

---

## 2. POST /api/drip-campaign

Генерирует сообщение для пациента в рамках Drip-campaign системы реактивации.

### Request

```json
{
  "patient_id": "1",
  "day": 3
}
```

**Поля запроса:**

- **patient_id** (string, обязательное) - ID пациента
- **day** (int, обязательное) - День кампании: 1, 3 или 7

### Response

```json
{
  "status": "success",
  "patient_id": "1",
  "patient_name": "Иванова Мария Петровна",
  "day": 3,
  "message_sent": "Уважаемая Мария Петровна, мы видим, что вы еще не записались на прием. Это важно для вашего здоровья. Пожалуйста, свяжитесь с нами или нажмите /start в боте.",
  "info": "Сообщение для дня 3 сгенерировано и поставлено в очередь отправки для patient_1"
}
```

---

## 3. GET /health

Health-check endpoint для мониторинга и Render/UptimeRobot.

### Response

```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cpu"
}
```

---

## 4. GET /

Корневой endpoint с метаинформацией сервиса.

### Response

```json
{
  "message": "MedMind AI Routing API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

## 5. POST /api/analyze-batch

Пакетный анализ нескольких заключений (для административных задач).

### Request

```json
[
  "BI-RADS 4, образование 15 мм",
  "Солидный узел 8 мм в S6 правого легкого"
]
```

### Response

```json
[
  { "urgency": "red", "confidence": 0.92 },
  { "urgency": "yellow", "confidence": 0.78 }
]
```

---

## 6. Формат Kafka-сообщения (DICOMREPORTNOTIFY)

В продакшене MedMind читает сообщения из топика DICOMREPORTNOTIFY в формате, определенном БФТ НПКЦ ДиТ ДЗМ (Приложение 4).

### Пример сообщения

```json
{
  "studyIUID": "1.2.40.0.13.1.1.1.10.89.12.24.20160326123235364.31235001",
  "aiResult": {
    "seriesIUID": "1.2.40.0.13.1.1.1.10.89.12.24.20160326123235364.31235001.1",
    "pathologyFlag": true,
    "norma": 0,
    "confidenceLevel": 86,
    "modelId": 1000,
    "modelVersion": "1.0.0",
    "report": "Маммографическая плотность ткани молочной железы по ACR: тип B...",
    "conclusion": "BI-RADS 4 правой молочной железы...",
    "dateTimeParams": {
      "downloadStartDT": "2026-10-04T09:00:00Z",
      "downloadEndDT": "2026-10-04T09:00:05Z",
      "processStartDT": "2026-10-04T09:00:06Z",
      "processEndDT": "2026-10-04T09:00:12Z"
    },
    "probParams": {
      "mmg": {
        "mmg_conf_level": 86,
        "mmg_rads_right": 4,
        "mmg_rads_left": 1
      }
    }
  }
}
```

**Маппинг полей БФТ → MedMind:**

- **pathologyFlag** (bool) → urgency = "red" if True else "green"
- **confidenceLevel** (int, 0-100) → ai_confidence = value / 100
- **report** (string) → Прямой маппинг
- **conclusion** (string) → Прямой маппинг
- **modelVersion** (string) → model_used
- **probParams.mmg.mmg_conf_level** (int) → Дополнительная уверенность по патологии
- **probParams.mmg.mmg_rads_right** (int, 1-5) → Уточнение типа (BI-RADS 4-5 → red)

---

## 7. Формат сообщения об ошибке (PUMCONSUMERERROR)

Если MedMind не может обработать исследование, отправляется сообщение в топик PUMCONSUMERERROR (Приложение 5 БФТ).

```json
{
  "studyIUID": "1.2.40.0.13.1.1.1.10.89.12.24.20160326025655364.35855",
  "aiResult": {
    "modelId": 1000,
    "error": "Incorrect number of images",
    "description": "Получено 1 изображение, ожидалось 2 (прямая + боковая проекция)",
    "dateTimeParams": {
      "downloadStartDT": "2026-10-04T09:00:00Z",
      "downloadEndDT": "2026-10-04T09:00:05Z"
    }
  }
}
```

**Категории ошибок (Таблица 1 БФТ):**

- **Server unavailable** - Нет связи с DICOM-сервером (НЕ на стороне ИИ)
- **Incorrect number of images** - Неверное количество изображений (НЕ на стороне ИИ)
- **Modality error** - Модальность не соответствует Kafka-сообщению (НЕ на стороне ИИ)
- **Series error** - Нет подходящих серий (НЕ на стороне ИИ)
- **Tag error** - Некорректные DICOM-теги (НЕ на стороне ИИ)
- **Body part error** - Анатомическая область не поддерживается (НЕ на стороне ИИ)
- **Images error** - Невозможно определить содержимое (НЕ на стороне ИИ)
- **Other** - Прочие ошибки ИИ-сервиса (НА стороне ИИ)

---

## 8. Pydantic-схемы (Python)

```python
class ConclusionRequest(BaseModel):
    text: str
    patient_id: str = "1"
    patient_name: Optional[str] = "Пациент"

class RoutingResponse(BaseModel):
    patient_id: str
    patient_name: str
    type: str  # mammography | ct_lungs | xray
    urgency: str  # red | yellow | green
    specialist: str
    timeframe: str
    red_flags: List[str]
    ai_confidence: float
    pathology_flag: bool           # БФТ: pathologyFlag
    confidence_level: int          # БФТ: confidenceLevel (0-100)
    report: str                    # БФТ: раздел "Описание" DICOM SR
    conclusion: str                # БФТ: раздел "Заключение" DICOM SR
    next_steps: Optional[List[str]] = []
    questions_for_doctor: Optional[List[str]] = []
    model_used: str = "medmind-rubert-v2"

class DripRequest(BaseModel):
    patient_id: str
    day: int  # 1, 3 или 7
```

---

## 9. Rate Limits и SLA

- **/api/analyze** - 100 req/min, SLA p95 < 2 сек (с моделью на CPU)
- **/api/drip-campaign** - 50 req/min, SLA p95 < 500 мс
- **/health** - unlimited, SLA p95 < 100 мс
- **/api/analyze-batch** - 10 req/min, SLA p95 < 10 сек (до 50 текстов)
