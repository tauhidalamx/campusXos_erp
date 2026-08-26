# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Quant Market Router
Interfaces with Symbol quotes tickers, paper trading portfolios, and alert triggers.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict
from campusx_backend_python.database import get_db

router = APIRouter(prefix="/market", tags=["Quant Market Analytics"])

class TradeRequest(BaseModel):
    symbol: str
    assetType: str
    type: str # BUY, SELL
    quantity: float
    price: float
    notes: str

@router.get("/quotes")
def get_market_quotes():
    return {
        "quotes": {
            "CAMPUSX": {"name": "CAMPUSX Academic Token", "price": 1450.22, "change": 59.20, "pct": 4.25, "sentiment": "STRONG BUY"},
            "INFRA": {"name": "Infrastructure Bond", "price": 102.15, "change": 0.12, "pct": 0.12, "sentiment": "HOLD"},
            "YIELD": {"name": "Student Placement Pool", "price": 342.88, "change": -5.15, "pct": -1.48, "sentiment": "BUY"},
            "VAULT": {"name": "Research IP Vault NFT", "price": 280.00, "change": 43.40, "pct": 18.40, "sentiment": "STRONG BUY"}
        }
    }

@router.get("/indices")
def get_market_indices():
    return {
        "indices": {
            "CAMPUSXX": {"price": 2842.10, "change": 102.40, "pct": 3.74},
            "CAMPUS": {"price": 10450.20, "change": -12.80, "pct": -0.12}
        }
    }

@router.post("/portfolio/trade")
def execute_trade(req: TradeRequest):
    # Simulates paper trades
    return {"success": True, "message": f"Simulated order of {req.quantity} {req.symbol} completed."}
