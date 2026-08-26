# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Connect Social Router
Handles feeds publishing, comment logging, and realtime WebSockets chat messaging.
"""

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from campusx_backend_python.database import get_db
from campusx_backend_python.models import Post, Comment

router = APIRouter(tags=["Connect Social Network"])

class PostCreate(BaseModel):
    content: str
    category: Optional[str] = "General"
    user_name: Optional[str] = "Anonymous"

class CommentCreate(BaseModel):
    content: str
    user_name: Optional[str] = "Anonymous"

@router.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.createdAt.desc()).all()
    if not posts:
        # Fallback feed list
        return [
            {"user_name": "Dean Evelyn Sterling", "category": "Academic Registry", "content": "All outstanding student degree credentials have been finalized and anchored to the local verification ledger.", "createdAt": datetime.utcnow()},
            {"user_name": "Prof. Marcus Chen", "category": "Research Symposium", "content": "Inviting all students to the upcoming Private AI Gateway architecture discussion. Check library assets for reading materials.", "createdAt": datetime.utcnow()},
            {"user_name": "System Operations Admin", "category": "Maintenance", "content": "Successfully rolled out light theme update across ERP components. Telemetry reports normal load.", "createdAt": datetime.utcnow()}
        ]
    return posts

@router.post("/posts")
def create_post(req: PostCreate, db: Session = Depends(get_db)):
    post = Post(
        content=req.content,
        category=req.category,
        user_name=req.user_name
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"success": True, "post_id": post.id}

@router.post("/posts/{post_id}/comments")
def add_comment(post_id: str, req: CommentCreate, db: Session = Depends(get_db)):
    comment = Comment(
        post_id=post_id,
        content=req.content,
        user_name=req.user_name
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {"success": True, "comment_id": comment.id}

# WebSocket Connection Manager for real-time messaging
class ChatManager:
    def __init__(self):
        self.active_sockets: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_sockets.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active_sockets:
            self.active_sockets.remove(ws)

    async def broadcast(self, message: str):
        for ws in self.active_sockets:
            try:
                await ws.send_text(message)
            except Exception:
                pass

chat_manager = ChatManager()

@router.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    await chat_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await chat_manager.broadcast(data)
    except WebSocketDisconnect:
        chat_manager.disconnect(websocket)
