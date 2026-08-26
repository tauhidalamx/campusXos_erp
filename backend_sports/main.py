# -*- coding: utf-8 -*-
"""
CampusX Sports OS - FastAPI Application & WebSockets Server
Establishes real-time stream ingestion, telemetry stats, and event synchronizations.
"""

import asyncio
import json
import time
from typing import Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline.cv_modules import PitchCalibrator
from pipeline.detector import FootballDetector
from pipeline.tracker import FootballTracker
from pipeline.tactical_ai import TacticalAI
from pipeline.highlights import MatchHighlightGenerator
from pipeline.ingest import StreamIngestFactory
from pipeline.sync import MatchEventSynchronizer
from pipeline.weather_engine import WeatherEngineFactory, WeatherImpactCalculator
from pipeline.sequence_models import TemporalPredictionEngine

app = FastAPI(title="CampusX Sports OS", version="1.0.0")

# Setup CORS to allow Next.js dashboard interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize modules
calibrator = PitchCalibrator()
calibrator.calibrate_homography(
    src_points=[[100, 200], [1820, 200], [100, 900], [1820, 900]],
    dst_points=[[0.0, 0.0], [105.0, 0.0], [0.0, 68.0], [105.0, 68.0]]
)

detector = FootballDetector()
tracker = FootballTracker()
tactics_ai = TacticalAI()
highlights_gen = MatchHighlightGenerator()
event_sync = MatchEventSynchronizer()

# Initialize Weather and Sequence Predictors
weather_client = WeatherEngineFactory.create_client("openweathermap", "mock_key")
weather_calculator = WeatherImpactCalculator()
prediction_engine = TemporalPredictionEngine()

# Mock official stats API events list
mock_official_api_events = [
    {"id": "api_ev_1", "type": "Goal", "time": "72:40", "player": "Jackson Cole"},
    {"id": "api_ev_2", "type": "Foul", "time": "32:15", "player": "Marcus Vance"},
    {"id": "api_ev_3", "type": "Yellow Card", "time": "45:10", "player": "Carlos Santana"}
]

# Connection managers for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("[WS] Client connected")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print("[WS] Client disconnected")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

# Request schemas
class EventTrigger(BaseModel):
    event_type: str
    player: Optional[str] = None
    team_id: Optional[int] = 0
    match_time: Optional[str] = "45:00"

@app.get("/api/sports/status")
def get_status():
    return {"status": "CampusX Sports OS CV Engine online"}

@app.get("/api/sports/highlights")
def get_highlights():
    return highlights_gen.get_all_highlights()

@app.post("/api/sports/bookmark")
def create_bookmark(event: EventTrigger):
    bmark = highlights_gen.trigger_bookmark(
        event_type=event.event_type,
        player_name=event.player,
        team_id=event.team_id,
        current_match_time=event.match_time
    )
    return {"success": True, "bookmark": bmark}

@app.get("/api/sports/fixtures")
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

# WebSocket match stream endpoint
@app.websocket("/ws/analytics")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        frame_idx = 0
        # Initialize temporal sequence buffer
        seq_buffer = [[0.5, 0.0, 1.0, 0, 0.9] for _ in range(10)]
        
        while True:
            start_time = time.time()
            
            # Fetch weather telemetry and calculate impacts
            weather_raw = weather_client.get_weather(40.7128, -74.0060)
            weather_impact = weather_calculator.calculate_impacts(weather_raw)
            
            # Simulate real-time frame capturing and analysis pipeline
            import numpy as np
            dummy_frame = np.zeros((1080, 1920, 3), dtype=np.uint8)
            
            # 1. Object Detection
            dets = detector.detect(dummy_frame)
            
            # 2. Object Tracking
            tracks = tracker.update(dets)
            
            # 3. Tactical Analysis
            analysis = tactics_ai.analyze_tactics(tracks)
            
            # 4. Offside detection calculations
            player_tracks = [t for t in tracks if t['class_id'] == 0]
            team_1_xs = [t['bbox'][0] for t in player_tracks if t['team_id'] == 1]
            last_defender_x = min(team_1_xs) if team_1_xs else 400
            
            offside_p1 = calibrator.project_image_to_pitch(last_defender_x, 100)
            offside_p2 = calibrator.project_image_to_pitch(last_defender_x, 900)

            # 5. Reconcile Event Synchronization
            aligned_events = event_sync.align_events(
                cv_events=highlights_gen.get_all_highlights(),
                official_api_events=mock_official_api_events
            )
            
            # 6. Update temporal buffer and run predictions
            pos_a = float(analysis.get('possession_team_a', 50.0)) / 100.0
            xg_diff = float(analysis.get('predictions', {}).get('expected_goals_a', 1.2)) - float(analysis.get('predictions', {}).get('expected_goals_b', 1.1))
            fatigue_val = weather_impact['fatigue_drain_multiplier']
            card_diff = 0
            pass_acc = weather_impact['passing_accuracy_multiplier']
            
            seq_buffer.pop(0)
            seq_buffer.append([pos_a, xg_diff, fatigue_val, card_diff, pass_acc])
            
            predictions_comparison = prediction_engine.run_inference(seq_buffer)
            
            # Compute processing latency in milliseconds
            processing_latency_ms = (time.time() - start_time) * 1000
            
            payload = {
                'frame_index': frame_idx,
                'timestamp': time.time(),
                'tracks': tracks,
                'analysis': {
                    **analysis,
                    'match_time': "72:45"
                },
                'offside_line': {
                    'defender_x_pixel': last_defender_x,
                    'p1_pitch': offside_p1,
                    'p2_pitch': offside_p2
                },
                'aligned_events': aligned_events,
                'weather': {
                    'current': weather_raw,
                    'impact': weather_impact
                },
                'predictions_comparison': predictions_comparison,
                'telemetry': {
                    'latency_ms': round(processing_latency_ms, 2),
                    'fps': 60,
                    'gpu_load': 42.5,
                    'cpu_load': 18.2,
                    'vram_used_gb': 3.4
                }
            }
            
            await websocket.send_text(json.dumps(payload))
            frame_idx += 1
            await asyncio.sleep(0.033)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS] Error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
