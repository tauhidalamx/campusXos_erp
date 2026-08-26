# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - CampusX Sports OS Module
Connects to Fast API WebSocket on port 8000.
Renders a live tactical pitch visualizer, telemetry stats, and AI expected goals (xG).
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.clock import Clock
from kivy.graphics import Color, RoundedRectangle, Line, Ellipse, Rectangle
import json
import threading
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, DataGrid
from api import ApiClient

class SportsPitchVisualizer(BoxLayout):
    """Draws a 2D radar football pitch overlaying active player coordinates."""
    def __init__(self, **kwargs):
        super(SportsPitchVisualizer, self).__init__(**kwargs)
        self.players = [] # List of {'pos': (x,y), 'team': 1/2}
        self.offside_x = 0.5 # ratio
        self.bind(pos=self.redraw, size=self.redraw)

    def update_frame(self, tracks, offside_line_pixel):
        self.players = []
        for t in tracks:
            # Map tracking bbox (relative to 1920x1080) to canvas ratio
            bbox = t.get("bbox", [0, 0, 0, 0])
            u = (bbox[0] + bbox[2]) / 2.0
            v = (bbox[1] + bbox[3]) / 2.0
            
            self.players.append({
                "x_ratio": u / 1920.0,
                "y_ratio": v / 1080.0,
                "team_id": t.get("team_id", 0)
            })
            
        if offside_line_pixel:
            self.offside_x = offside_line_pixel / 1920.0
            
        self.redraw()

    def redraw(self, *args):
        self.canvas.clear()
        w, h = self.size
        x, y = self.pos
        
        with self.canvas:
            # Draw green grass background
            Color(0.18, 0.49, 0.20, 1) # Pitch Green
            RoundedRectangle(pos=self.pos, size=self.size, radius=[8])
            
            # White field lines
            Color(1, 1, 1, 0.6)
            Line(rectangle=(x + 10, y + 10, w - 20, h - 20), width=1.5)
            
            # Midfield line
            mid_x = x + w / 2.0
            Line(points=[mid_x, y + 10, mid_x, y + h - 10], width=1.5)
            
            # Center circle
            Ellipse(pos=(mid_x - 30, y + h/2.0 - 30), size=(60, 60), angle_start=0, angle_end=360, width=1.5)
            # Center spot
            Ellipse(pos=(mid_x - 3, y + h/2.0 - 3), size=(6, 6))
            
            # Draw red Offside line projection
            Color(0.88, 0.11, 0.28, 0.9) # Accent Ruby
            off_line_x = x + 10 + self.offside_x * (w - 20)
            Line(points=[off_line_x, y + 10, off_line_x, y + h - 10], width=2, dash_length=4, dash_offset=2)
            
            # Draw Players as colored dots
            for p in self.players:
                px = x + 10 + p["x_ratio"] * (w - 20)
                py = y + 10 + (1 - p["y_ratio"]) * (h - 20) # invert Y for Kivy coordinate space
                
                if p["team_id"] == 1:
                    Color(0.31, 0.27, 0.90, 1) # Team A Indigo
                else:
                    Color(0.85, 0.47, 0.02, 1) # Team B Amber
                    
                Ellipse(pos=(px - 5, py - 5), size=(10, 10))


class SportsDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(SportsDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.api = ApiClient()
        self.is_listening = False
        
        self.build_ui()
        self.start_live_telemetry()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='vertical', size_hint_y=None, height=60, spacing=4)
        title = Label(text="CampusX Sports OS & CV Tracker", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        desc = Label(text="Real-time WebSockets computer vision analytics, tactical offside metrics, and weather impacts.", font_size=11, color=theme.text_subtle, halign='left')
        desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        header.add_widget(desc)
        
        # Live Stats grid
        self.stats_panel = GridLayout(cols=4, spacing=12, size_hint_y=None, height=75)
        
        self.xg_card = PremiumCard(padding=6, spacing=2)
        self.xg_card.add_widget(Label(text="EXPECTED GOALS (XG)", font_size=9, color=theme.text_subtle, halign='left'))
        self.xg_val = Label(text="A: 0.00 | B: 0.00", font_size=12, bold=True, color=theme.text_main, halign='left')
        self.xg_card.add_widget(self.xg_val)
        
        self.pos_card = PremiumCard(padding=6, spacing=2)
        self.pos_card.add_widget(Label(text="BALL POSSESSION", font_size=9, color=theme.text_subtle, halign='left'))
        self.pos_val = Label(text="Team A: 50% | Team B: 50%", font_size=12, bold=True, color=theme.text_main, halign='left')
        self.pos_card.add_widget(self.pos_val)
        
        self.weather_card = PremiumCard(padding=6, spacing=2)
        self.weather_card.add_widget(Label(text="ENVIRONMENT FACTOR", font_size=9, color=theme.text_subtle, halign='left'))
        self.weather_val = Label(text="Passing: 100% | Drain: 1.0x", font_size=12, bold=True, color=theme.text_main, halign='left')
        self.weather_card.add_widget(self.weather_val)

        self.gpu_card = PremiumCard(padding=6, spacing=2)
        self.gpu_card.add_widget(Label(text="CV COMPUTE LATENCY", font_size=9, color=theme.text_subtle, halign='left'))
        self.gpu_val = Label(text="0.00 ms / 60 FPS", font_size=12, bold=True, color=theme.text_main, halign='left')
        self.gpu_card.add_widget(self.gpu_val)
        
        self.stats_panel.add_widget(self.xg_card)
        self.stats_panel.add_widget(self.pos_card)
        self.stats_panel.add_widget(self.weather_card)
        self.stats_panel.add_widget(self.gpu_card)
        
        # Mid Panel (Pitch Tracking Radar)
        mid_layout = BoxLayout(orientation='horizontal', spacing=15)
        
        pitch_card = PremiumCard(spacing=8, size_hint_x=0.6)
        lbl_p = Label(text="2D TACTICAL PITCH RADAR FEED (WEBSOCKETS)", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_p.bind(size=lambda l, s: setattr(l, 'text_size', s))
        pitch_card.add_widget(lbl_p)
        
        self.pitch_feed = SportsPitchVisualizer()
        pitch_card.add_widget(self.pitch_feed)
        
        # Right Panel (Official Bookmarks Timeline)
        timeline_card = PremiumCard(spacing=8, size_hint_x=0.4)
        lbl_t = Label(text="MATCH EVENT TIMELINE", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_t.bind(size=lambda l, s: setattr(l, 'text_size', s))
        timeline_card.add_widget(lbl_t)
        
        self.timeline_table = DataGrid(headers=["Time", "Event", "Player Involved"])
        timeline_card.add_widget(self.timeline_table)
        
        mid_layout.add_widget(pitch_card)
        mid_layout.add_widget(timeline_card)
        
        self.add_widget(header)
        self.add_widget(self.stats_panel)
        self.add_widget(mid_layout)

    def start_live_telemetry(self):
        """Subscribe to Fast API real-time tracking WebSocket."""
        self.is_listening = True
        
        # Connect to FastAPI sports server WebSocket on port 8000
        # If server is not running, api.py connects asynchronously and retries
        self.api.start_websocket_listener(
            ws_url="ws://localhost:8000/ws/analytics",
            on_message_callback=self.on_ws_telemetry_message
        )
        
        # Load match events
        self.load_match_events()

    def on_ws_telemetry_message(self, data):
        """Callback fired when a WebSockets message arrives."""
        if not self.is_listening:
            return
            
        Clock.schedule_once(lambda dt: self.update_telemetry_ui(data), 0)

    def update_telemetry_ui(self, data):
        try:
            # 1. Update Expected Goals
            analysis = data.get("analysis", {})
            predictions = analysis.get("predictions", {})
            xg_a = float(predictions.get("expected_goals_a", 0.0))
            xg_b = float(predictions.get("expected_goals_b", 0.0))
            self.xg_val.text = f"A: {xg_a:.2f} | B: {xg_b:.2f} xG"
            
            # 2. Update Possession
            pos_a = analysis.get("possession_team_a", 50.0)
            self.pos_val.text = f"Team A: {pos_a}% | Team B: {100-pos_a}%"
            
            # 3. Update Weather Impacts
            weather = data.get("weather", {})
            impact = weather.get("impact", {})
            pass_acc = float(impact.get("passing_accuracy_multiplier", 1.0)) * 100
            drain = impact.get("fatigue_drain_multiplier", 1.0)
            self.weather_val.text = f"Passing: {pass_acc:.0f}% | Drain: {drain:.1f}x"
            
            # 4. Update GPU telemetry
            tele = data.get("telemetry", {})
            lat = tele.get("latency_ms", 0.0)
            fps = tele.get("fps", 60)
            self.gpu_val.text = f"{lat} ms / {fps} FPS"
            
            # 5. Update Football Pitch radar tracks
            tracks = data.get("tracks", [])
            offside_x = data.get("offside_line", {}).get("defender_x_pixel", None)
            self.pitch_feed.update_frame(tracks, offside_x)
        except Exception as e:
            print(f"[Sports Dashboard] UI Update failed: {e}")

    def load_match_events(self):
        # Local mock match events matching pipeline.sync data
        mock_events = [
            ("72:40", "Goal", "Jackson Cole"),
            ("45:10", "Yellow Card", "Carlos Santana"),
            ("32:15", "Foul", "Marcus Vance"),
            ("12:04", "Save", "Keeper Alpha")
        ]
        self.timeline_table.clear_rows()
        for t, event, player in mock_events:
            self.timeline_table.add_row([t, event, player])

    def close(self):
        """Call this to clean up WebSocket subscriptions when leaving screen."""
        self.is_listening = False
        # Do not shut down global listener, just ignore callbacks
