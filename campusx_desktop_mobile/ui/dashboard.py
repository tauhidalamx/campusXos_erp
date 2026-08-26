# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Main Dashboard Shell
Integrates navigation sidebars, theme toggles, search filters, and sliding AI panels.
"""

from kivy.uix.screenmanager import Screen
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.button import Button
from kivy.graphics import Color, Rectangle, Line
from kivy.clock import Clock
from kivy.app import App
import threading
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput
from ui.modules.erp import ErpDashboard
from ui.modules.connect import ConnectDashboard
from ui.modules.chain import ChainDashboard
from ui.modules.market import MarketDashboard
from ui.modules.sports import SportsDashboard
from ui.modules.soc import SocDashboard
from ui.modules.ai import AiDashboard
from ui.modules.chrome import BrowserView
from api import ApiClient

class DashboardScreen(Screen):
    def __init__(self, **kwargs):
        super(DashboardScreen, self).__init__(**kwargs)
        self.api = ApiClient()
        self.active_module = "erp"
        
        # UI state
        self.sidebar_visible = True
        self.ai_panel_visible = False
        
        self.build_shell()
        theme.register_listener(self.update_shell_theme)

    def build_shell(self):
        self.clear_widgets()
        
        # Root layout (horizontal split)
        self.root_layout = BoxLayout(orientation='horizontal')
        self.root_layout.bind(pos=self.draw_bg, size=self.draw_bg)
        
        # 1. Left Navigation Sidebar
        self.sidebar = BoxLayout(orientation='vertical', size_hint_x=0.25, padding=[12, 16], spacing=8)
        self.sidebar.bind(pos=self.draw_sidebar_bg, size=self.draw_sidebar_bg)
        
        header_box = BoxLayout(orientation='horizontal', size_hint_y=None, height=35, spacing=5)
        app_title = Label(text="CAMPUSX OS", font_size=18, bold=True, color=theme.text_main, halign='left')
        app_title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        refresh_btn = Button(text="↻", font_size=16, color=theme.primary, background_color=[0, 0, 0, 0], bold=True, size_hint_x=None, width=30)
        refresh_btn.bind(on_release=self.reload_dashboard)
        header_box.add_widget(app_title)
        header_box.add_widget(refresh_btn)
        
        self.sidebar.add_widget(header_box)
        self.sidebar.add_widget(BoxLayout(size_hint_y=None, height=10))
        
        # Navigation Menu links
        self.nav_buttons = {}
        navs = [
            ("erp", "🏫 ERP Operations"),
            ("connect", "💬 CampusX Connect"),
            ("chain", "🔗 CampusX Chain"),
            ("market", "📈 CampusX Market"),
            ("sports", "🏆 Sports & Athletics"),
            ("soc", "🛡️ Security Operations"),
            ("storage", "📂 Cloud & Cache Storage"),
            ("chrome", "🌐 Chrome Portal")
        ]
        
        for key, name in navs:
            btn = CustomButton(text=f"  {name}", size_hint_y=None, height=35, bg_color=[1,1,1,0], text_color=theme.text_muted)
            btn.bind(on_release=lambda x, k=key: self.switch_module(k))
            self.sidebar.add_widget(btn)
            self.nav_buttons[key] = btn
            
        self.sidebar.add_widget(BoxLayout(size_hint_y=0.3)) # Spacer
        
        # User details card
        self.user_card = PremiumCard(size_hint_y=None, height=65, padding=8, spacing=2)
        self.user_lbl = Label(text="Loading...", font_size=11, bold=True, color=theme.text_main, halign='left')
        self.user_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.role_lbl = Label(text="Role: Guest", font_size=9, color=theme.text_subtle, halign='left')
        self.role_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.user_card.add_widget(self.user_lbl)
        self.user_card.add_widget(self.role_lbl)
        
        self.sidebar.add_widget(self.user_card)
        
        logout_btn = CustomButton(text="Sign Out", size_hint_y=None, height=30, bg_color=theme.accent_ruby)
        logout_btn.bind(on_release=self.perform_logout)
        self.sidebar.add_widget(logout_btn)
        
        # 2. Main Content Area (Vertical: Header + Viewport)
        self.main_content = BoxLayout(orientation='vertical', size_hint_x=0.75, padding=16, spacing=10)
        
        # Header (Search + Theme toggle + AI Copilot Toggle)
        header_row = BoxLayout(orientation='horizontal', size_hint_y=None, height=40, spacing=10)
        
        self.search_input = CustomTextInput(hint_text="Global search index (users, courses, events)...", size_hint_x=0.55)
        self.search_input.bind(on_text_validate=self.perform_global_search)
        
        theme_btn = CustomButton(text="🌓 Theme", size_hint_x=0.15, bg_color=theme.bg_tertiary, text_color=theme.text_muted)
        theme_btn.bind(on_release=lambda x: theme.toggle_theme())
        
        self.ai_toggle_btn = CustomButton(text="🤖 AI Copilot", size_hint_x=0.2, bg_color=theme.primary)
        self.ai_toggle_btn.bind(on_release=self.toggle_ai_panel)
        
        header_row.add_widget(self.search_input)
        header_row.add_widget(theme_btn)
        header_row.add_widget(self.ai_toggle_btn)
        self.main_content.add_widget(header_row)
        
        # Viewport viewport container
        self.viewport = BoxLayout(orientation='vertical')
        self.main_content.add_widget(self.viewport)
        
        # 3. Sliding AI Panel (Right Panel - Collapsible)
        self.ai_panel = BoxLayout(orientation='vertical', size_hint_x=0.35, padding=[10, 16])
        self.ai_panel.bind(pos=self.draw_ai_panel_bg, size=self.draw_ai_panel_bg)
        
        ai_header = BoxLayout(orientation='horizontal', size_hint_y=None, height=30)
        ai_title = Label(text="🤖 AI Copilot Assistant", font_size=12, bold=True, color=theme.text_main, halign='left')
        ai_title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        ai_close = Button(text="✕", font_size=12, color=theme.text_muted, background_color=[0,0,0,0], size_hint_x=None, width=30)
        ai_close.bind(on_release=self.toggle_ai_panel)
        ai_header.add_widget(ai_title)
        ai_header.add_widget(ai_close)
        
        self.ai_panel.add_widget(ai_header)
        self.ai_widget = AiDashboard()
        self.ai_panel.add_widget(self.ai_widget)
        
        # Assemble (AI panel added only when toggled)
        self.root_layout.add_widget(self.sidebar)
        self.root_layout.add_widget(self.main_content)
        
        self.add_widget(self.root_layout)
        self.switch_module(self.active_module)

    def draw_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_primary)
            Rectangle(pos=instance.pos, size=instance.size)

    def draw_sidebar_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_secondary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(points=[instance.pos[0] + instance.size[0], instance.pos[1], instance.pos[0] + instance.size[0], instance.pos[1] + instance.size[1]], width=1)

    def draw_ai_panel_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_secondary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(points=[instance.pos[0], instance.pos[1], instance.pos[0], instance.pos[1] + instance.size[1]], width=1)

    def update_shell_theme(self):
        self.build_shell()

    def reload_dashboard(self, *args):
        # Refresh current active view
        self.switch_module(self.active_module)
        if hasattr(self.viewport.children[0], 'load_data'):
            self.viewport.children[0].load_data()

    def on_enter(self):
        self.reload_dashboard()

    def reload_user_profile(self):
        app = App.get_running_app()
        if app.user_profile:
            self.user_lbl.text = app.user_profile.get("name", "User")
            self.role_lbl.text = f"Role: {app.user_profile.get('role', 'Guest').upper()}"

    def switch_module(self, mod_key):
        # Shutdown sports websockets if switching away from sports
        if self.active_module == "sports" and mod_key != "sports":
            if self.viewport.children and isinstance(self.viewport.children[0], SportsDashboard):
                self.viewport.children[0].close()
                
        self.active_module = mod_key
        
        # Reset button highlights
        for key, btn in self.nav_buttons.items():
            if key == mod_key:
                btn.bg_color = theme.primary
                btn.color = [1, 1, 1, 1]
            else:
                btn.bg_color = [1, 1, 1, 0]
                btn.color = theme.text_muted
                
        self.viewport.clear_widgets()
        
        # Instantiate and add appropriate sub-dashboard
        if mod_key == "erp":
            self.viewport.add_widget(ErpDashboard())
        elif mod_key == "connect":
            self.viewport.add_widget(ConnectDashboard())
        elif mod_key == "chain":
            self.viewport.add_widget(ChainDashboard())
        elif mod_key == "market":
            self.viewport.add_widget(MarketDashboard())
        elif mod_key == "sports":
            self.viewport.add_widget(SportsDashboard())
        elif mod_key == "soc":
            self.viewport.add_widget(SocDashboard())
        elif mod_key == "storage":
            from ui.modules.storage import StorageDashboard
            self.viewport.add_widget(StorageDashboard())
        elif mod_key == "chrome":
            self.viewport.add_widget(BrowserView())
            
        self.reload_user_profile()

    def toggle_ai_panel(self, *args):
        self.ai_panel_visible = not self.ai_panel_visible
        if self.ai_panel_visible:
            # Shift content columns width and slide in AI panel
            self.sidebar.size_hint_x = 0.20
            self.main_content.size_hint_x = 0.55
            self.root_layout.add_widget(self.ai_panel)
            self.ai_toggle_btn.bg_color = theme.accent_cyan
        else:
            self.sidebar.size_hint_x = 0.25
            self.main_content.size_hint_x = 0.75
            self.root_layout.remove_widget(self.ai_panel)
            self.ai_toggle_btn.bg_color = theme.primary

    def perform_global_search(self, instance):
        query = self.search_input.text.strip().lower()
        if not query:
            return
        
        self.search_input.text = ""
        # Route matching global indexes
        if "sport" in query or "match" in query or "fixtures" in query:
            self.switch_module("sports")
        elif "blockchain" in query or "hash" in query or "sbt" in query:
            self.switch_module("chain")
        elif "market" in query or "trading" in query or "stock" in query:
            self.switch_module("market")
        elif "soc" in query or "threat" in query or "incidents" in query:
            self.switch_module("soc")
        else:
            self.switch_module("erp")
            # Navigate to rosters sub-tab
            if self.viewport.children and isinstance(self.viewport.children[0], ErpDashboard):
                self.viewport.children[0].switch_tab("rosters")

    def perform_logout(self, instance):
        # Stop any active sockets
        self.api.stop_all_websockets()
        
        app = App.get_running_app()
        app.user_profile = None
        
        self.manager.transition.direction = 'right'
        self.manager.current = 'login'
