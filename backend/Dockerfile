FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=100 \
    -i https://pypi.tuna.tsinghua.edu.cn/simple \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements.txt

COPY . .

RUN python -c "from transformers import AutoModel, AutoTokenizer; \
    AutoModel.from_pretrained('maybelaterzxcsd/medmind-rubert-v2'); \
    AutoTokenizer.from_pretrained('maybelaterzxcsd/medmind-rubert-v2')"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]