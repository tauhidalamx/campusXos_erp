# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - SOC Router
Handles security operation alerts, WAF mitigation logging, and firewall incidents.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from campusx_backend_python.database import get_db
from campusx_backend_python.models import SocIncident

router = APIRouter(prefix="/soc", tags=["Security Operations"])

class IncidentCreate(BaseModel):
    title: str
    severity: str
    status: str
    operator: str

@router.get("/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(SocIncident).all()
    if not incidents:
        return [
            {"title": "Brute-Force Attack Mitigation", "severity": "HIGH", "status": "Mitigated", "operator": "SecOps Agent Bravo"},
            {"title": "Unauthorized API Gateway Access", "severity": "CRITICAL", "status": "Investigating", "operator": "System Guardian Engine"},
            {"title": "SSL Certificate Rotation Completed", "severity": "INFO", "status": "Resolved", "operator": "Autonomous SecOps Cron"}
        ]
    return incidents

@router.post("/incidents")
def create_incident(req: IncidentCreate, db: Session = Depends(get_db)):
    inc = SocIncident(
        title=req.title,
        severity=req.severity,
        status=req.status,
        operator=req.operator
    )
    db.add(inc)
    db.commit()
    db.refresh(inc)
    return {"success": True, "incident_id": inc.id}
