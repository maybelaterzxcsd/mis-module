from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Optional

class MedMindModel:
    def __init__(self, model_path: str = "./medmind-rubert-v2"):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
    def load(self):
        """Ленивая загрузка модели"""
        if self.model is None:
            print(f"Загрузка модели из {self.model_path}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_path,
                ignore_mismatched_sizes=True 
            )
            self.model.to(self.device)
            self.model.eval()
            print(f"Модель загружена на {self.device}")
    
    def predict_urgency(self, text: str) -> dict:
        """
        Предсказывает уровень срочности
        Возвращает: {"urgency": "red/yellow/green", "confidence": 0.87}
        """
        self.load()
        
        inputs = self.tokenizer(
            text, 
            return_tensors="pt", 
            truncation=True, 
            max_length=512,
            padding=True
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)[0]
            predicted_class = torch.argmax(logits, dim=1).item()
        
        urgency_map = {0: "green", 1: "yellow", 2: "red"}
        urgency = urgency_map.get(predicted_class, "yellow")
        confidence = probabilities[predicted_class].item()
        
        return {
            "urgency": urgency,
            "confidence": round(confidence, 3)
        }
    
    def get_embeddings(self, text: str) -> list:
        """Получить эмбеддинги текста (для похожести)"""
        self.load()
        
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs, output_hidden_states=True)
            embeddings = outputs.hidden_states[-1].mean(dim=1).squeeze().cpu().numpy().tolist()
        
        return embeddings

model_instance = MedMindModel()