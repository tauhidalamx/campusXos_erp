# -*- coding: utf-8 -*-
"""
CAMPUSX OS - Cross-Platform Client Application
Developed using Kivy Python framework.
Supports Windows, macOS, Linux, and Android deployment.
Entry point file bootstrapping the Screen Manager.
"""

import os
import sys
from kivy.app import App
from kivy.uix.screenmanager import ScreenManager
from kivy.core.window import Window
from kivy.utils import get_color_from_hex, platform
from kivy.lang import Builder

# Resolve path for PyInstaller package bundling
if getattr(sys, 'frozen', False):
    bundle_dir = sys._MEIPASS
else:
    bundle_dir = os.path.dirname(os.path.abspath(__file__))

# Add bundle_dir to python path to ensure imports resolve correctly during frozen runtime
if bundle_dir not in sys.path:
    sys.path.insert(0, bundle_dir)

# Load KV layout file if it exists
kv_path = os.path.join(bundle_dir, 'campusx_app.kv')
if os.path.exists(kv_path):
    Builder.load_file(kv_path)

# Set window size and styles for desktop testing
Window.size = (1100, 750)
Window.clearcolor = get_color_from_hex('#F8FAFC')

# Import our modular screens after system setup
from ui.login import LoginScreen
from ui.dashboard import DashboardScreen

class CampusXApp(App):
    user_profile = None

    def build(self):
        self.title = "CAMPUSX OS System Software"
        
        # Setup Screen Manager with FadeTransition transitions
        sm = ScreenManager()
        
        self.login_screen = LoginScreen(name='login')
        self.dashboard_screen = DashboardScreen(name='dashboard')
        
        sm.add_widget(self.login_screen)
        sm.add_widget(self.dashboard_screen)
        return sm

    def on_stop(self):
        # Stop background WebSocket listeners during shutdown
        from api import ApiClient
        ApiClient().stop_all_websockets()

if __name__ == '__main__':
    CampusXApp().run()
