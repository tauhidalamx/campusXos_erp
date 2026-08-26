# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Login Screen
Handles secure user authentication, demo credential shortcuts, and biometric simulation.
"""

import threading
from kivy.uix.screenmanager import Screen, FadeTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.graphics import Color, Rectangle, Line
from kivy.clock import Clock
from kivy.app import App
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput
from api import ApiClient

class LoginScreen(Screen):
    def __init__(self, **kwargs):
        super(LoginScreen, self).__init__(**kwargs)
        self.api = ApiClient()
        self.build_ui()
        theme.register_listener(self.update_ui_theme)

    def build_ui(self):
        self.clear_widgets()
        
        # Base horizontal container split in two parts (for desktops)
        self.root_layout = BoxLayout(orientation='horizontal')
        self.root_layout.bind(pos=self.draw_bg, size=self.draw_bg)
        
        # Left Panel (Brand panel with list of features)
        self.left_panel = BoxLayout(orientation='vertical', size_hint=(0.45, 1), padding=40, spacing=20)
        self.left_panel.bind(pos=self.draw_brand_bg, size=self.draw_brand_bg)
        
        self.logo_label = Label(text="🛡️", font_name="Arial", font_size=64, size_hint_y=None, height=80, color=theme.primary)
        self.title_label = Label(text="CAMPUSX OS", font_size=28, bold=True, color=theme.text_main, size_hint_y=None, height=40)
        self.subtitle_label = Label(text="Super App Enterprise Ecosystem", font_size=13, color=theme.text_subtle, size_hint_y=None, height=20)
        
        self.desc_box = BoxLayout(orientation='vertical', spacing=12)
        features = [
            ("✓ Connected ERP Ledger", "Academic & administrative commands"),
            ("✓ Sports Live CV Analytics", "Real-time tracker & predictions"),
            ("✓ Blockchain Verification", "Soulbound degree verification"),
            ("✓ Persistent AI Copilot", "RAG query & analytics dashboards")
        ]
        for title, desc in features:
            f_box = BoxLayout(orientation='vertical', size_hint_y=None, height=45)
            f_title = Label(text=title, font_size=12, bold=True, color=theme.text_main, halign='left', valign='middle')
            f_title.bind(size=lambda l, s: setattr(l, 'text_size', s))
            f_desc = Label(text=desc, font_size=10, color=theme.text_muted, halign='left', valign='middle')
            f_desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
            f_box.add_widget(f_title)
            f_box.add_widget(f_desc)
            self.desc_box.add_widget(f_box)

        self.left_panel.add_widget(BoxLayout(size_hint_y=0.1))
        self.left_panel.add_widget(self.logo_label)
        self.left_panel.add_widget(self.title_label)
        self.left_panel.add_widget(self.subtitle_label)
        self.left_panel.add_widget(BoxLayout(size_hint_y=0.05))
        self.left_panel.add_widget(self.desc_box)
        self.left_panel.add_widget(BoxLayout(size_hint_y=0.1))
        
        # Right Panel (LoginForm panel)
        self.right_panel = BoxLayout(orientation='vertical', size_hint=(0.55, 1), padding=45, spacing=12)
        
        welcome_lbl = Label(text="Welcome Back to CampusX", font_size=22, bold=True, color=theme.text_main, size_hint_y=None, height=30, halign='left')
        welcome_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        # Email & password inputs
        self.email_input = CustomTextInput(hint_text="Email Address (e.g. admin@campusx.edu)")
        self.password_input = CustomTextInput(hint_text="Password (e.g. admin123)", password=True)
        
        self.error_label = Label(text="", color=theme.accent_ruby, font_size=11, size_hint_y=None, height=18, halign='left')
        self.error_label.bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        login_btn = CustomButton(text="Sign In Securely", size_hint_y=None, height=45)
        login_btn.bind(on_release=self.perform_login)
        
        # Biometrics login simulator row
        biometric_row = BoxLayout(orientation='horizontal', size_hint_y=None, height=40, spacing=10)
        bio_icon_lbl = Label(text="👋 Touch ID / Fingerprint Auth", font_size=12, color=theme.text_muted, halign='left')
        bio_icon_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        bio_btn = CustomButton(text="Authenticate", size_hint_x=0.3, bg_color=theme.accent_cyan)
        bio_btn.bind(on_release=self.perform_biometric_auth)
        biometric_row.add_widget(bio_icon_lbl)
        biometric_row.add_widget(bio_btn)
        
        # Demo Credentials Tray
        demo_box = BoxLayout(orientation='vertical', spacing=4, size_hint_y=None, height=130)
        demo_title = Label(text="DEMO ACCOUNTS SHORTCUTS:", font_size=10, bold=True, color=theme.text_subtle, halign='left')
        demo_title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        demo_box.add_widget(demo_title)
        
        creds = [
            ("Super Admin Console", "admin@campusx.edu", "admin123"),
            ("Student Portal", "student@campusx.edu", "student123"),
            ("Faculty Operations", "faculty@campusx.edu", "faculty123")
        ]
        for label, em, pw in creds:
            btn = Button(text=f"{label}: {em} (pw: {pw})", font_size=11, color=theme.primary, background_color=[0, 0, 0, 0], halign='left', size_hint_y=None, height=22)
            btn.bind(size=lambda l, s: setattr(l, 'text_size', s))
            btn.bind(on_release=lambda x, e=em, p=pw: self.set_credentials(e, p))
            demo_box.add_widget(btn)

        self.right_panel.add_widget(BoxLayout(size_hint_y=0.05))
        self.right_panel.add_widget(welcome_lbl)
        self.right_panel.add_widget(BoxLayout(size_hint_y=0.02))
        
        lbl_em = Label(text="Email Address", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=15, halign='left')
        lbl_em.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.right_panel.add_widget(lbl_em)
        self.right_panel.add_widget(self.email_input)
        
        lbl_pw = Label(text="Password", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=15, halign='left')
        lbl_pw.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.right_panel.add_widget(lbl_pw)
        self.right_panel.add_widget(self.password_input)
        
        self.right_panel.add_widget(self.error_label)
        self.right_panel.add_widget(login_btn)
        self.right_panel.add_widget(biometric_row)
        self.right_panel.add_widget(BoxLayout(size_hint_y=0.03))
        self.right_panel.add_widget(demo_box)
        self.right_panel.add_widget(BoxLayout(size_hint_y=0.05))
        
        # Assemble
        self.root_layout.add_widget(self.left_panel)
        self.root_layout.add_widget(self.right_panel)
        self.add_widget(self.root_layout)

    def draw_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_primary)
            Rectangle(pos=instance.pos, size=instance.size)

    def draw_brand_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_tertiary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(points=[instance.pos[0] + instance.size[0], instance.pos[1], instance.pos[0] + instance.size[0], instance.pos[1] + instance.size[1]], width=1)

    def update_ui_theme(self):
        self.logo_label.color = theme.primary
        self.title_label.color = theme.text_main
        self.subtitle_label.color = theme.text_subtle
        self.build_ui()

    def set_credentials(self, email, password):
        self.email_input.text = email
        self.password_input.text = password

    def perform_login(self, instance):
        email = self.email_input.text.strip()
        password = self.password_input.text.strip()
        if not email or not password:
            self.error_label.text = "Error: Fields cannot be empty."
            return
            
        self.error_label.text = "Contacting authentication gates..."
        threading.Thread(target=self._login_worker, args=(email, password)).start()

    def _login_worker(self, email, password):
        res = self.api.login(email, password)
        if res.get("success"):
            Clock.schedule_once(lambda dt: self.on_login_success(res.get("user")), 0)
        else:
            Clock.schedule_once(lambda dt: self.on_login_failed(res.get("error")), 0)

    def perform_biometric_auth(self, instance):
        """Simulates face/fingerprint authentication using cached profile."""
        cached_user = self.api.get_cached_response("user_profile")
        if cached_user:
            self.error_label.text = "Simulating Biometrics Scan... ✓ Success"
            Clock.schedule_once(lambda dt: self.on_login_success(cached_user), 1.0)
        else:
            self.error_label.text = "No local profile found. Please login once manually."

    def on_login_success(self, user):
        self.error_label.text = ""
        app = App.get_running_app()
        app.user_profile = user
        
        self.manager.transition = FadeTransition(duration=0.25)
        self.manager.current = 'dashboard'
        
        # Notify Dashboard to reload
        dashboard = self.manager.get_screen('dashboard')
        dashboard.reload_dashboard()

    def on_login_failed(self, error):
        self.error_label.text = f"Authentication Error: {error}"
