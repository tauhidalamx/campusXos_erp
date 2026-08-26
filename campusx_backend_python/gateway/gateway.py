# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Authentication Gateway Controls
Exposes authorization middleware layers checking JWT scopes and student/faculty roles.
"""

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from campusx_backend_python.config import settings

security = HTTPBearer()

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verifies access token payload or raises 401 HTTP exception."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Auth token signature expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid auth token credentials.")

class RoleVerification:
    """RBAC validation wrapper ensuring client role meets allowed matrix."""
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, payload: dict = Depends(verify_jwt_token)):
        user_role = payload.get("role")
        if not user_role or user_role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied: Role permissions not met.")
        return payload
