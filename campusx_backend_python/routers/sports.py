# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Sports Router
Handles athlete directories, team lists, and live match fixtures schedules.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/sports", tags=["Sports Operations"])

@router.get("/fixtures")
def get_fixtures():
    return [
        {
            "id": "match_101",
            "competition": "CampusX Champions Cup",
            "home_team": "CampusX United FC",
            "away_team": "Consortium Athletic",
            "score": "2 - 1",
            "status": "LIVE",
            "time": "72:45"
        }
    ]

@router.get("/status")
def get_status():
    return {"status": "Sports OS CV Engine Online"}
