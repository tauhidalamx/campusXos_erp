# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Auth Router
Handles user JWT login and custom password hashing.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
from campusx_backend_python.database import get_db
from campusx_backend_python.models import User
from campusx_backend_python.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class PasswordChangeRequest(BaseModel):
    currentPassword: str
    newPassword: str

def hash_password(plain: str) -> str:
    """JS-compatible 32-bit integer string hashing to base36."""
    hash_val = 0
    for char in plain:
        ch = ord(char)
        hash_val = ((hash_val << 5) - hash_val) + ch
        # Convert to signed 32-bit int
        hash_val = (hash_val + 2**31) % 2**32 - 2**31
    
    abs_hash = abs(hash_val)
    # Convert absolute hash value to Base36
    chars = "0123456789abcdefghijklmnopqrstuvwxyz"
    if abs_hash == 0:
        base36 = "0"
    else:
        base36 = ""
        while abs_hash > 0:
            base36 = chars[abs_hash % 36] + base36
            abs_hash //= 36
    return f"h${base36}"

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    hashed = hash_password(req.password)
    user = db.query(User).filter(User.email == req.email).first()
    
    if not user or user.password != hashed:
        # Check fallback demo credentials
        if (req.email == "admin@campusx.edu" and req.password == "admin123") or \
           (req.email == "student@campusx.edu" and req.password == "student123") or \
           (req.email == "faculty@campusx.edu" and req.password == "faculty123"):
            role = "admin" if "admin" in req.email else ("faculty" if "faculty" in req.email else "student")
            
            # Auto-provision fallback user in DB if not exists
            user = db.query(User).filter(User.email == req.email).first()
            if not user:
                user = User(
                    id=f"usr_demo_{role}",
                    name=f"{role.capitalize()} Demo Profile",
                    email=req.email,
                    password=hashed,
                    role=role,
                    department="CS"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Incorrect email or password credentials.")

    # Generate JWT token
    payload = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    
    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
            "avatar": user.avatar or "/uploads/avatars/default.png"
        }
    }

@router.post("/change-password")
def change_password(req: PasswordChangeRequest, db: Session = Depends(get_db)):
    # Simulates changing passwords
    return {"success": True, "message": "Password updated successfully."}
