# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - SQLAlchemy Models
Defines all SQL schemas for users, courses, results, attendance, and finance.
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from campusx_backend_python.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False) # superadmin, admin, registrar, student, faculty, HOD, dean
    avatar = Column(String, nullable=True)
    department = Column(String, nullable=False)
    walletAddress = Column(String, unique=True, nullable=True)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

class Course(Base):
    __tablename__ = "courses"
    code = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    isActive = Column(Boolean, default=True)

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(String, primary_key=True, default=generate_uuid)
    studentId = Column(String, ForeignKey("users.id"))
    courseId = Column(String, ForeignKey("courses.code"))
    semester = Column(Integer, nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, COMPLETED, DROPPED
    createdAt = Column(DateTime, default=datetime.utcnow)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(String, primary_key=True, default=generate_uuid)
    courseCode = Column(String, ForeignKey("courses.code"))
    title = Column(String, nullable=False)
    rubricHash = Column(String, nullable=True)
    dueDate = Column(DateTime, nullable=False)
    weightage = Column(Integer, default=100)
    isDraft = Column(Boolean, default=True)
    isArchived = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(String, primary_key=True, default=generate_uuid)
    assignmentId = Column(String, ForeignKey("assignments.id"))
    studentId = Column(String, ForeignKey("users.id"))
    ipfsHash = Column(String, nullable=True)
    fileUrl = Column(String, nullable=True)
    submittedAt = Column(DateTime, default=datetime.utcnow)
    isLate = Column(Boolean, default=False)
    txHash = Column(String, nullable=True)

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(String, primary_key=True, default=generate_uuid)
    submissionId = Column(String, ForeignKey("submissions.id"), unique=True)
    evaluatorId = Column(String, ForeignKey("users.id"))
    score = Column(Float, nullable=False)
    feedbackHash = Column(String, nullable=True)
    comments = Column(String, nullable=True)
    evaluatedAt = Column(DateTime, default=datetime.utcnow)
    txHash = Column(String, nullable=True)

class Exam(Base):
    __tablename__ = "exams"
    id = Column(String, primary_key=True, default=generate_uuid)
    courseCode = Column(String, ForeignKey("courses.code"))
    name = Column(String, nullable=False) # Midterm, End_Semester
    examDate = Column(DateTime, nullable=False)
    durationMins = Column(Integer, default=180)
    isPublished = Column(Boolean, default=False)

class Result(Base):
    __tablename__ = "results"
    id = Column(String, primary_key=True, default=generate_uuid)
    examId = Column(String, ForeignKey("exams.id"))
    studentId = Column(String, ForeignKey("users.id"))
    internalMarks = Column(Float, default=0.0)
    externalMarks = Column(Float, default=0.0)
    practicalMarks = Column(Float, default=0.0)
    totalMarks = Column(Float, default=0.0)
    grade = Column(String, default="F") # A+, A, B, C, F
    gpaPoint = Column(Float, default=0.0)
    status = Column(String, default="FAIL") # PASS, FAIL
    isPublished = Column(Boolean, default=False)
    txHash = Column(String, nullable=True)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(String, primary_key=True, default=generate_uuid)
    courseCode = Column(String, ForeignKey("courses.code"))
    studentId = Column(String, ForeignKey("users.id"))
    date = Column(String, nullable=False) # YYYY-MM-DD
    status = Column(String, default="ABSENT") # PRESENT, ABSENT
    method = Column(String, default="MANUAL")
    markedById = Column(String, ForeignKey("users.id"), nullable=True)
    isLocked = Column(Boolean, default=False)
    txHash = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

class AttendanceCorrection(Base):
    __tablename__ = "attendance_corrections"
    id = Column(String, primary_key=True, default=generate_uuid)
    attendanceId = Column(String, ForeignKey("attendance.id"))
    studentId = Column(String, ForeignKey("users.id"))
    requestedStatus = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    reviewedById = Column(String, ForeignKey("users.id"), nullable=True)
    comments = Column(String, nullable=True)
    txHash = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

class SocIncident(Base):
    __tablename__ = "soc_incidents"
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    severity = Column(String, default="INFO") # CRITICAL, HIGH, MEDIUM, INFO
    status = Column(String, default="Active")
    operator = Column(String, default="Guardian Engine")
    timestamp = Column(DateTime, default=datetime.utcnow)

class StudioWorkflow(Base):
    __tablename__ = "studio_workflows"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    status = Column(String, default="Draft")
    triggers = Column(String, nullable=True) # JSON string
    steps = Column(String, nullable=True) # JSON string
    author = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

class AdmissionsApplication(Base):
    __tablename__ = "admissions_applications"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    department = Column(String, nullable=False)
    status = Column(String, default="Applied") # Applied, Pending, Approved
    createdAt = Column(DateTime, default=datetime.utcnow)

class ProcurementOrder(Base):
    __tablename__ = "procurement_orders"
    id = Column(String, primary_key=True, default=generate_uuid)
    item = Column(String, nullable=False)
    qty = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    status = Column(String, default="Requested")
    price = Column(Float, default=0.0)
    createdAt = Column(DateTime, default=datetime.utcnow)

class CompliancePolicy(Base):
    __tablename__ = "compliance_policies"
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="Draft")
    body = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

class MarketWatchlist(Base):
    __tablename__ = "market_watchlist"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    symbol = Column(String, nullable=False)
    asset_type = Column(String, default="STOCK")

class MarketPortfolio(Base):
    __tablename__ = "market_portfolio"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    balance = Column(Float, default=100000.0)
    is_simulated = Column(Boolean, default=True)

class MarketTransaction(Base):
    __tablename__ = "market_transactions"
    id = Column(String, primary_key=True, default=generate_uuid)
    portfolio_id = Column(String, ForeignKey("market_portfolio.id"))
    symbol = Column(String, nullable=False)
    asset_type = Column(String, default="STOCK")
    type = Column(String, nullable=False) # BUY, SELL
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)

class MarketAlert(Base):
    __tablename__ = "market_alerts"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    symbol = Column(String, nullable=False)
    type = Column(String, default="PRICE")
    condition = Column(String, default="ABOVE")
    value = Column(Float, nullable=False)
    is_triggered = Column(Boolean, default=False)
    channels = Column(String, default="in-app")

class SportsFixture(Base):
    __tablename__ = "sports_fixtures"
    id = Column(String, primary_key=True, default=generate_uuid)
    competition = Column(String, nullable=False)
    home_team = Column(String, nullable=False)
    away_team = Column(String, nullable=False)
    score = Column(String, default="0-0")
    status = Column(String, default="Scheduled") # Scheduled, Live, Finished
    time = Column(String, nullable=True)

# Post and comments schema matching local mongoose model / sqlite schema in server.js
class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=True)
    user_name = Column(String, default="Anonymous")
    content = Column(String, nullable=False)
    category = Column(String, default="General")
    createdAt = Column(DateTime, default=datetime.utcnow)

class Comment(Base):
    __tablename__ = "comments"
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("posts.id"))
    user_name = Column(String, default="Anonymous")
    content = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
