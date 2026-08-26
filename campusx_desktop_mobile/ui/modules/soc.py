# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Security Operations Center (SOC) Module
Displays realtime platform incident feeds, firewall telemetry, and audit trail records.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.clock import Clock
import threading
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput, DataGrid
from api import ApiClient

class SocDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(SocDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.api = ApiClient()
        
        self.build_ui()
        self.load_data()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='vertical', size_hint_y=None, height=60, spacing=4)
        title = Label(text="Security Operations Command (SOC)", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        desc = Label(text="Platform threat intelligence, real-time WAF logs, and database access audits.", font_size=11, color=theme.text_subtle, halign='left')
        desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        header.add_widget(desc)
        
        # Telemetry panel
        tele_panel = GridLayout(cols=3, spacing=15, size_hint_y=None, height=70)
        items = [
            ("SHIELD WAF STATUS", "Shield Active", theme.accent_emerald),
            ("MITIGATED THREATS", "4,901 Blocks/hr", theme.accent_cyan),
            ("GLOBAL INCIDENTS", "0 Active", theme.accent_ruby)
        ]
        for name, value, col in items:
            card = PremiumCard(border_color=col, padding=8, spacing=2)
            n_lbl = Label(text=name, font_size=9, color=theme.text_subtle, halign='left')
            n_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            v_lbl = Label(text=value, font_size=13, bold=True, color=theme.text_main, halign='left')
            v_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            card.add_widget(n_lbl)
            card.add_widget(v_lbl)
            tele_panel.add_widget(card)
            
        # Incident table grid
        self.grid_card = PremiumCard(spacing=8)
        lbl_inc = Label(text="ACTIVE INCIDENT REGISTER", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_inc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.grid_card.add_widget(lbl_inc)
        
        self.table = DataGrid(headers=["Incident Title", "Severity", "Status", "Responsible Operator"])
        self.grid_card.add_widget(self.table)
        
        # Add new incident mock form at the bottom
        form_card = PremiumCard(size_hint_y=None, height=65, padding=8, spacing=8)
        form_layout = BoxLayout(orientation='horizontal', spacing=8)
        self.inc_input = CustomTextInput(hint_text="Report new system anomaly / incident description...")
        
        report_btn = CustomButton(text="Deploy Alert", size_hint_x=0.25, bg_color=theme.accent_ruby)
        report_btn.bind(on_release=self.report_incident)
        
        form_layout.add_widget(self.inc_input)
        form_layout.add_widget(report_btn)
        form_card.add_widget(form_layout)
        
        self.add_widget(header)
        self.add_widget(tele_panel)
        self.add_widget(self.grid_card)
        self.add_widget(form_card)

    def load_data(self):
        threading.Thread(target=self._fetch_incidents_worker).start()

    def _fetch_incidents_worker(self):
        data = self.api.fetch_get("/soc/incidents")
        Clock.schedule_once(lambda dt: self.populate_table(data), 0)

    def populate_table(self, data):
        self.table.clear_rows()
        
        display_data = []
        if data and isinstance(data, list):
            for row in data:
                display_data.append((
                    row.get("title", "Anomaly"),
                    row.get("severity", "Info").upper(),
                    row.get("status", "Active").capitalize(),
                    row.get("operator", "Auto Guardian")
                ))
        else:
            # Local demo fallback data
            display_data = [
                ("Brute-Force Attack Mitigation", "HIGH", "Mitigated", "SecOps Agent Bravo"),
                ("Unauthorized API Gateway Access", "CRITICAL", "Investigating", "System Guardian Engine"),
                ("SSL Certificate Rotation Completed", "INFO", "Resolved", "Autonomous SecOps Cron"),
                ("Database Replication Synchronization", "MEDIUM", "Resolved", "DBA Admin Staff")
            ]
            
        for title, severity, status, operator in display_data:
            self.table.add_row([title, severity, status, operator])

    def report_incident(self, instance):
        title = self.inc_input.text.strip()
        if not title:
            return
            
        self.inc_input.text = ""
        payload = {
            "title": title,
            "severity": "MEDIUM",
            "status": "Active",
            "operator": self.api.user_profile.get("name", "Operator") if self.api.user_profile else "Guest Console"
        }
        
        threading.Thread(target=self._report_worker, args=(payload,)).start()

    def _report_worker(self, payload):
        self.api.fetch_post("/soc/incidents", payload)
        self.load_data()
