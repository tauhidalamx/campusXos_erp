# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - ERP Operations Router
Handles directories rosters, admissions pipeline, classes attendance, and results publications.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from campusx_backend_python.database import get_db
from campusx_backend_python.models import User, AdmissionsApplication, Attendance, AttendanceCorrection, Result, Course

router = APIRouter(tags=["ERP Operations"])

# Request Schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    department: str

class AdmissionCreate(BaseModel):
    name: str
    email: str
    department: str

class AttendanceMark(BaseModel):
    studentId: str
    courseCode: str
    date: str
    status: str # PRESENT, ABSENT
    method: Optional[str] = "MANUAL"

class AttendanceLock(BaseModel):
    courseCode: str
    date: str

class AttendanceCorrectionRequest(BaseModel):
    attendanceId: str
    requestedStatus: str
    reason: str

class AttendanceCorrectionReview(BaseModel):
    correctionId: str
    status: str # APPROVED, REJECTED
    comments: Optional[str] = None

# --- 1. USER DIRECTORY ---
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/users")
def create_user(req: UserCreate, db: Session = Depends(get_db)):
    # Hash password using custom hash algorithm from auth
    from campusx_backend_python.routers.auth import hash_password
    hashed = hash_password(req.password)
    user = User(
        name=req.name,
        email=req.email,
        password=hashed,
        role=req.role,
        department=req.department
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"success": True, "user_id": user.id}

# --- 2. ADMISSIONS ---
@router.get("/admissions/applications")
def get_admissions(db: Session = Depends(get_db)):
    applications = db.query(AdmissionsApplication).all()
    if not applications:
        return [
            {"name": "Alice Johnson", "email": "alice@example.com", "department": "Computer Science", "status": "Approved"},
            {"name": "Bob Smith", "email": "bob@example.com", "department": "Data Science", "status": "Pending"}
        ]
    return applications

@router.post("/admissions/applications")
def create_admission(req: AdmissionCreate, db: Session = Depends(get_db)):
    app = AdmissionsApplication(
        name=req.name,
        email=req.email,
        department=req.department,
        status="Applied"
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return {"success": True, "application_id": app.id}

# --- 3. CLASS ATTENDANCE ---
@router.get("/attendance")
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    return records

@router.post("/attendance")
def mark_attendance(req: AttendanceMark, db: Session = Depends(get_db)):
    rec = Attendance(
        studentId=req.studentId,
        courseCode=req.courseCode,
        date=req.date,
        status=req.status,
        method=req.method
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    
    # Trigger background worker synchronization mock here
    return {"success": True, "attendance_id": rec.id}

@router.post("/attendance/lock")
def lock_attendance(req: AttendanceLock, db: Session = Depends(get_db)):
    db.query(Attendance).filter(
        Attendance.courseCode == req.courseCode,
        Attendance.date == req.date
    ).update({"isLocked": True})
    db.commit()
    return {"success": True}

@router.get("/attendance/corrections")
def get_corrections(db: Session = Depends(get_db)):
    return db.query(AttendanceCorrection).all()

@router.post("/attendance/corrections")
def request_correction(req: AttendanceCorrectionRequest, db: Session = Depends(get_db)):
    # Retrieve user from session context or mock student id
    corr = AttendanceCorrection(
        attendanceId=req.attendanceId,
        studentId="STU001",
        requestedStatus=req.requestedStatus,
        reason=req.reason,
        status="PENDING"
    )
    db.add(corr)
    db.commit()
    return {"success": True, "correction_id": corr.id}

@router.post("/attendance/corrections/review")
def review_correction(req: AttendanceCorrectionReview, db: Session = Depends(get_db)):
    corr = db.query(AttendanceCorrection).filter(AttendanceCorrection.id == req.correctionId).first()
    if not corr:
        raise HTTPException(status_code=404, detail="Correction request not found.")
        
    corr.status = req.status
    corr.comments = req.comments
    
    # If approved, update the parent attendance record status
    if req.status == "APPROVED":
        db.query(Attendance).filter(Attendance.id == corr.attendanceId).update({"status": corr.requestedStatus})
        
    db.commit()
    return {"success": True}
