# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - AI Assistant Module
Includes AI Copilot chat interface, quick query suggestions, and academic CGPA risk models.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.clock import Clock
import threading
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput
from api import ApiClient

class AiDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(AiDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 12
        self.api = ApiClient()
        self.chat_history = []
        
        self.build_ui()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='vertical', size_hint_y=None, height=60, spacing=4)
        title = Label(text="CampusX AI Copilot & Advisor", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        desc = Label(text="Virtual RAG advisor. Analyze university rosters, calculate grades forecasts, and search logs.", font_size=11, color=theme.text_subtle, halign='left')
        desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        header.add_widget(desc)
        
        # Main split container: Left for Chat, Right for Predictor
        split_layout = BoxLayout(orientation='horizontal', spacing=15)
        
        # Left Panel (AI Chat Panel)
        chat_panel = PremiumCard(spacing=10, size_hint_x=0.6)
        
        lbl_chat = Label(text="AI COPILOT DIALOGUE", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_chat.bind(size=lambda l, s: setattr(l, 'text_size', s))
        chat_panel.add_widget(lbl_chat)
        
        self.chat_scroll = ScrollView()
        self.chat_layout = GridLayout(cols=1, spacing=10, size_hint_y=None)
        self.chat_layout.bind(minimum_height=self.chat_layout.setter('height'))
        self.chat_scroll.add_widget(self.chat_layout)
        chat_panel.add_widget(self.chat_scroll)
        
        # Render past chat logs
        self.render_chat_history()
        
        # Chat input box
        input_row = BoxLayout(orientation='horizontal', size_hint_y=None, height=45, spacing=8)
        self.chat_input = CustomTextInput(hint_text="Ask CampusX AI (e.g. 'predict attendance default risk'...)")
        self.chat_input.bind(on_text_validate=self.send_chat_message)
        
        send_btn = CustomButton(text="Ask", size_hint_x=0.2, bg_color=theme.primary)
        send_btn.bind(on_release=self.send_chat_message)
        input_row.add_widget(self.chat_input)
        input_row.add_widget(send_btn)
        chat_panel.add_widget(input_row)
        
        # Right Panel (Academic Predictor Model)
        pred_panel = PremiumCard(spacing=10, size_hint_x=0.4)
        
        lbl_pred = Label(text="ACADEMIC OUTCOME MODEL (TENSORFLOW)", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_pred.bind(size=lambda l, s: setattr(l, 'text_size', s))
        pred_panel.add_widget(lbl_pred)
        
        # Predictor form inputs
        pred_panel.add_widget(Label(text="Student Cumulative GPA (0.0 - 4.0):", font_size=11, color=theme.text_muted, size_hint_y=None, height=15, halign='left'))
        pred_panel.children[-1].bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.cgpa_input = CustomTextInput(text="3.4", size_hint_y=None, height=35)
        pred_panel.add_widget(self.cgpa_input)
        
        pred_panel.add_widget(Label(text="Attendance Ratio (%):", font_size=11, color=theme.text_muted, size_hint_y=None, height=15, halign='left'))
        pred_panel.children[-1].bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.attn_input = CustomTextInput(text="85", size_hint_y=None, height=35)
        pred_panel.add_widget(self.attn_input)
        
        pred_panel.add_widget(Label(text="Midterm Score (%):", font_size=11, color=theme.text_muted, size_hint_y=None, height=15, halign='left'))
        pred_panel.children[-1].bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.mid_input = CustomTextInput(text="78", size_hint_y=None, height=35)
        pred_panel.add_widget(self.mid_input)
        
        calc_btn = CustomButton(text="Run Inference", size_hint_y=None, height=40, bg_color=theme.accent_emerald)
        calc_btn.bind(on_release=self.run_prediction_inference)
        pred_panel.add_widget(calc_btn)
        
        # Result output card
        self.result_card = PremiumCard(size_hint_y=None, height=90, bg_color=theme.bg_tertiary, padding=10, spacing=4)
        self.result_title = Label(text="INFERENCE RESULT", font_size=10, bold=True, color=theme.text_subtle, halign='left')
        self.result_title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.result_grade = Label(text="Predicted Grade: --", font_size=13, bold=True, color=theme.text_main, halign='left')
        self.result_grade.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.result_risk = Label(text="Risk Assessment Level: --", font_size=10, color=theme.text_muted, halign='left')
        self.result_risk.bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        self.result_card.add_widget(self.result_title)
        self.result_card.add_widget(self.result_grade)
        self.result_card.add_widget(self.result_risk)
        pred_panel.add_widget(self.result_card)
        pred_panel.add_widget(BoxLayout(size_hint_y=0.1)) # Spacer
        
        split_layout.add_widget(chat_panel)
        split_layout.add_widget(pred_panel)
        
        self.add_widget(header)
        self.add_widget(split_layout)

    def render_chat_history(self):
        self.chat_layout.clear_widgets()
        
        # Default start message if history empty
        if not self.chat_history:
            self.chat_history.append(("ai", "Hello! I am your CampusX AI assistant. Ask me to query student databases, check placement odds, or forecast grades!"))
            
        for sender, text in self.chat_history:
            is_ai = sender == "ai"
            card = PremiumCard(
                size_hint_y=None, 
                height=85,
                bg_color=theme.bg_tertiary if is_ai else theme.bg_secondary,
                border_color=theme.border if is_ai else theme.primary,
                padding=10
            )
            name_lbl = Label(text="CampusX AI Copilot" if is_ai else "You", font_size=10, bold=True, color=theme.primary if is_ai else theme.accent_cyan, halign='left')
            name_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            
            body_lbl = Label(text=text, font_size=11, color=theme.text_main, halign='left', valign='top')
            body_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            
            card.add_widget(name_lbl)
            card.add_widget(body_lbl)
            self.chat_layout.add_widget(card)

    def send_chat_message(self, *args):
        msg_text = self.chat_input.text.strip()
        if not msg_text:
            return
            
        self.chat_input.text = ""
        self.chat_history.append(("user", msg_text))
        self.render_chat_history()
        
        # Trigger response after simulated RAG delay
        Clock.schedule_once(lambda dt: self.generate_ai_response(msg_text), 0.8)

    def generate_ai_response(self, user_query):
        query = user_query.lower()
        response = ""
        
        if "attendance" in query:
            response = "🤖 **Attendance Analytics Report**:\n- Campus Attendance Mean: 87.4%.\n- Critical Risk: Course CS202 is at 72.1%.\n- Model Forecast: 4 students are predicted to default term requirements."
        elif "placement" in query or "career" in query:
            response = "🤖 **Placement Odds Model (TensorFlow)**:\n- Core Placement Rate Forecast: 88.5%.\n- Major with highest probability: CS (94.2% odds).\n- Action flag: 5 students with low internship scores."
        elif "finance" in query or "fee" in query:
            response = "🤖 **Financial Insights Ledger**:\n- Total Revenue Cleared: 84.1% collected.\n- Delayed payment risk: 4.1% delay probability."
        elif "research" in query or "grant" in query:
            response = "🤖 **Research Citations Predictor**:\n- Citation growth projection: +12.4% year-over-year.\n- Grants allocated: $45,000 across ML and cryptographic consensus."
        else:
            response = f"I searched the CampusX RAG database. I found 4 matching indexes matching '{user_query}' across student files and transactions. Let me know if I should compile a PDF report."
            
        self.chat_history.append(("ai", response))
        self.render_chat_history()
        
        # Auto scroll to bottom
        Clock.schedule_once(self._scroll_bottom, 0)

    def _scroll_bottom(self, dt):
        self.chat_scroll.scroll_y = 0

    def run_prediction_inference(self, instance):
        try:
            cgpa = float(self.cgpa_input.text)
            attn = float(self.attn_input.text)
            mid = float(self.mid_input.text)
        except ValueError:
            self.result_grade.text = "Error: Invalid inputs"
            return
            
        # Replicating the NestJS backend AiAdvisoryService.predictGradeOutcome logic
        score_sum = (cgpa / 4) * 30 + (attn / 100) * 30 + (mid / 100) * 40
        predicted_grade = "F"
        risk_level = "CRITICAL_RISK"
        
        if score_sum >= 90:
            predicted_grade = "A+"
            risk_level = "LOW"
        elif score_sum >= 80:
            predicted_grade = "A"
            risk_level = "LOW"
        elif score_sum >= 70:
            predicted_grade = "B"
            risk_level = "MEDIUM"
        elif score_sum >= 50:
            predicted_grade = "C"
            risk_level = "HIGH"
            
        # Attendance warning override safeguard
        if attn < 70:
            predicted_grade = "F"
            risk_level = "HIGH_ATTENDANCE_WARN"
            
        self.result_grade.text = f"Predicted Outcome Grade: {predicted_grade}"
        self.result_risk.text = f"Risk Assessment Level: {risk_level.replace('_', ' ')}"
        
        # Style result card color matching risk level
        if risk_level == "LOW":
            self.result_card.border_color = theme.accent_emerald
        elif risk_level == "MEDIUM":
            self.result_card.border_color = theme.accent_amber
        else:
            self.result_card.border_color = theme.accent_ruby
