# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - API Connection Engine
Handles REST requests to Express/NestJS and FastAPI backends, WebSockets, JWTs, and offline caching.
"""

import json
import socket
import threading
import requests
import asyncio
import sqlite3
import os
from typing import Dict, Any, List, Optional, Callable

# Server address definitions
API_URL = os.environ.get("CAMPUSX_API_URL", "http://localhost:5000/api")
SPORTS_API_URL = os.environ.get("CAMPUSX_SPORTS_API_URL", "http://localhost:8000/api")
SPORTS_WS_URL = os.environ.get("CAMPUSX_SPORTS_WS_URL", "ws://localhost:8000/ws/analytics")

class ApiClient:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ApiClient, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.token: Optional[str] = None
        self.user_profile: Optional[Dict[str, Any]] = None
        self.offline_mode: bool = False
        self.ws_thread: Optional[threading.Thread] = None
        self.ws_loop: Optional[asyncio.AbstractEventLoop] = None
        self.active_websockets: Dict[str, Any] = {}
        
        # Local Offline cache db
        self.cache_db_path = "campusx_offline_cache.db"
        self._init_cache_db()
        self._initialized = True

    def _init_cache_db(self):
        """Initializes sqlite database to cache responses for offline resilience."""
        conn = sqlite3.connect(self.cache_db_path)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS api_cache (
                endpoint TEXT PRIMARY KEY,
                response_json TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS local_settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        conn.commit()
        conn.close()

    def get_cached_response(self, endpoint: str) -> Optional[Any]:
        try:
            conn = sqlite3.connect(self.cache_db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT response_json FROM api_cache WHERE endpoint = ?", (endpoint,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return json.loads(row[0])
        except Exception as e:
            print(f"[API Cache] Error reading cache: {e}")
        return None

    def save_cached_response(self, endpoint: str, data: Any):
        try:
            conn = sqlite3.connect(self.cache_db_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO api_cache (endpoint, response_json, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)",
                (endpoint, json.dumps(data))
            )
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[API Cache] Error writing cache: {e}")

    def clear_cache(self):
        try:
            conn = sqlite3.connect(self.cache_db_path)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM api_cache")
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[API Cache] Error clearing cache: {e}")

    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Performs JWT authentication and loads profile on success."""
        try:
            r = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password}, timeout=4)
            if r.status_code == 200:
                data = r.json()
                if data.get("success"):
                    self.token = data.get("token")
                    self.user_profile = data.get("user")
                    self.offline_mode = False
                    # Cache successful credentials securely or store token
                    self.save_cached_response("user_profile", self.user_profile)
                    return {"success": True, "user": self.user_profile}
            return {"success": False, "error": r.json().get("error", "Invalid credentials.")}
        except Exception as e:
            print(f"[API] Login failed: {e}. Fallback to offline check.")
            # Local offline fallback check matching default accounts
            if (email == "admin@campusx.edu" and password == "admin123") or \
               (email == "student@campusx.edu" and password == "student123") or \
               (email == "faculty@campusx.edu" and password == "faculty123"):
                role = "admin" if "admin" in email else ("faculty" if "faculty" in email else "student")
                name = email.split("@")[0].capitalize() + " Demo"
                
                # Retrieve from cache or build mock
                self.user_profile = self.get_cached_response("user_profile")
                if not self.user_profile or self.user_profile.get("email") != email:
                    self.user_profile = {
                        "id": "usr_offline_demo",
                        "email": email,
                        "name": name,
                        "role": role,
                        "department": "CS" if role != "finance_manager" else "Finance",
                        "avatar": "/uploads/avatars/default.png"
                    }
                self.offline_mode = True
                return {"success": True, "user": self.user_profile, "offline": True}
            return {"success": False, "error": "Connection error & invalid local credentials."}

    def change_password(self, current_pw: str, new_pw: str) -> bool:
        if self.offline_mode:
            return False
        try:
            headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
            r = requests.post(f"{API_URL}/auth/change-password", 
                              json={"currentPassword": current_pw, "newPassword": new_pw}, 
                              headers=headers, timeout=4)
            return r.status_code == 200
        except Exception:
            return False

    def fetch_get(self, endpoint: str, use_sports_url: bool = False, timeout: int = 2) -> Optional[Any]:
        """Generic GET API fetcher with cache updates and offline fallback."""
        url_prefix = SPORTS_API_URL if use_sports_url else API_URL
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        
        if not self.offline_mode:
            try:
                r = requests.get(f"{url_prefix}{endpoint}", headers=headers, timeout=timeout)
                if r.status_code == 200:
                    data = r.json()
                    self.save_cached_response(endpoint, data)
                    return data
            except Exception as e:
                print(f"[API] GET {endpoint} failed: {e}. Attempting cache load.")
        
        # Load from offline cache fallback
        return self.get_cached_response(endpoint)

    def fetch_post(self, endpoint: str, payload: Dict[str, Any], use_sports_url: bool = False, timeout: int = 3) -> Dict[str, Any]:
        """Generic POST API poster."""
        if self.offline_mode:
            return {"success": False, "error": "Offline mode active. Cannot modify database."}
            
        url_prefix = SPORTS_API_URL if use_sports_url else API_URL
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        try:
            r = requests.post(f"{url_prefix}{endpoint}", json=payload, headers=headers, timeout=timeout)
            if r.status_code in [200, 201]:
                return {"success": True, "data": r.json()}
            return {"success": False, "error": r.json().get("error", "Request failed.")}
        except Exception as e:
            return {"success": False, "error": str(e)}

    # WebSocket Realtime Event loop
    def start_websocket_listener(self, ws_url: str, on_message_callback: Callable[[Dict[str, Any]], None]):
        """Starts a background WebSocket connection managed via AsyncIO."""
        if ws_url in self.active_websockets:
            return
            
        self.active_websockets[ws_url] = True
        
        def run_loop():
            asyncio.run(self._ws_connect_async(ws_url, on_message_callback))
            
        thread = threading.Thread(target=run_loop, daemon=True)
        thread.start()

    async def _ws_connect_async(self, ws_url: str, on_message_callback: Callable[[Dict[str, Any]], None]):
        import websockets
        while self.active_websockets.get(ws_url):
            try:
                async with websockets.connect(ws_url) as websocket:
                    print(f"[WS] Connected to {ws_url}")
                    while self.active_websockets.get(ws_url):
                        msg = await websocket.recv()
                        try:
                            data = json.loads(msg)
                            on_message_callback(data)
                        except Exception as e:
                            print(f"[WS] Message parse error: {e}")
            except Exception as e:
                print(f"[WS] Disconnected from {ws_url}: {e}. Retrying in 5 seconds...")
                await asyncio.sleep(5)

    def stop_all_websockets(self):
        for k in self.active_websockets:
            self.active_websockets[k] = False
        self.active_websockets.clear()
