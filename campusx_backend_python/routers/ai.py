# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - AI Assistant Router
Handles virtual LLM chats, RAG assistant queries, and student CGPA risk indicators.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ai", tags=["AI Advisory Engine"])

class ChatMessage(BaseModel):
    message: str

class GradePredictionInput(BaseModel):
    cgpa: float
    attendance: float
    midterm: float

@router.post("/chat")
def post_chat(req: ChatMessage):
    q = req.message.lower()
    if "attendance" in q:
        reply = "🤖 **Attendance Analytics Report**:\n- Campus Attendance Mean: 87.4%.\n- Critical Risk: Course CS202 is at 72.1%.\n- Model Forecast: 4 students are predicted to default term requirements."
    elif "placement" in q or "career" in q:
        reply = "🤖 **Placement Odds Model (TensorFlow)**:\n- Core Placement Rate Forecast: 88.5%.\n- Major with highest probability: CS (94.2% odds).\n- Action flag: 5 students with low internship scores."
    else:
        reply = f"I searched the CampusX RAG index and found 4 matching documents regarding '{req.message}'. Let me know if I should compile a PDF report."
        
    return {"reply": reply}

@router.post("/predict-outcome")
def predict_outcome(req: GradePredictionInput):
    # Match the NestJS/Express predictive model calculations
    score_sum = (req.cgpa / 4.0) * 30 + (req.attendance / 100.0) * 30 + (req.midterm / 100.0) * 40
    predicted_grade = "F"
    risk_level = "CRITICAL_RISK"
    
    if score_sum >= 90:
        predicted_grade = "A+"
        risk_level = "LOW"
    elif score_sum >= 80:
        predicted_grade = "A"
        risk_level = "LOW"
    elif score_sum >= 70:
        predicted_grade = "B"
        risk_level = "MEDIUM"
    elif score_sum >= 50:
        predicted_grade = "C"
        risk_level = "HIGH"
        
    if req.attendance < 70:
        predicted_grade = "F"
        risk_level = "HIGH_ATTENDANCE_WARN"
        
    return {
        "predicted_grade": predicted_grade,
        "risk_level": risk_level
    }
