# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Chrome Webview Fallback
Renders native web view elements (Android) or opens fallback system Chrome on Desktops.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.graphics import Color, Rectangle, Line
from kivy.utils import platform
import webbrowser
from ui.theme import theme
from ui.components import PremiumCard, CustomButton

class BrowserView(BoxLayout):
    def __init__(self, default_url="http://localhost:3000/connect", **kwargs):
        super(BrowserView, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 8
        self.current_url = default_url

        # Browser Navigation header
        self.nav_bar = BoxLayout(orientation='horizontal', size_hint_y=None, height=35, spacing=5, padding=4)
        self.nav_bar.bind(pos=self.draw_nav_bg, size=self.draw_nav_bg)
        
        back_btn = Button(text="◀", font_size=12, color=theme.text_main, background_color=[0,0,0,0], size_hint_x=None, width=30)
        forward_btn = Button(text="▶", font_size=12, color=theme.text_main, background_color=[0,0,0,0], size_hint_x=None, width=30)
        refresh_btn = Button(text="↻", font_size=12, color=theme.text_main, background_color=[0,0,0,0], size_hint_x=None, width=30)
        
        self.url_input = TextInput(text=self.current_url, font_size=11, multiline=False, size_hint_x=0.7, 
                                   background_color=theme.bg_tertiary, foreground_color=theme.text_main)
        self.url_input.bind(on_text_validate=self.load_url_from_input)
        
        chrome_btn = CustomButton(text="Open System Chrome", font_size=10, size_hint_x=0.2, height=28, bg_color=theme.primary)
        chrome_btn.bind(on_release=lambda x: self.open_in_chrome())
        
        self.nav_bar.add_widget(back_btn)
        self.nav_bar.add_widget(forward_btn)
        self.nav_bar.add_widget(refresh_btn)
        self.nav_bar.add_widget(self.url_input)
        self.nav_bar.add_widget(chrome_btn)
        
        self.add_widget(self.nav_bar)
        
        # Browser viewport area
        self.viewport = BoxLayout()
        self.add_widget(self.viewport)
        
        theme.register_listener(self.on_theme_changed)
        self.load_url(self.current_url)

    def draw_nav_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_secondary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(points=[instance.pos[0], instance.pos[1], instance.pos[0] + instance.size[0], instance.pos[1]], width=1)
            Line(points=[instance.pos[0], instance.pos[1] + instance.size[1], instance.pos[0] + instance.size[0], instance.pos[1] + instance.size[1]], width=1)

    def on_theme_changed(self):
        self.url_input.background_color = theme.bg_tertiary
        self.url_input.foreground_color = theme.text_main
        self.nav_bar.canvas.before.clear()
        self.draw_nav_bg(self.nav_bar, None)

    def load_url_from_input(self, instance):
        self.load_url(instance.text)

    def load_url(self, url):
        self.current_url = url
        self.url_input.text = url
        if platform == 'android':
            self.init_android_webview()
        else:
            self.init_desktop_mockup()

    def open_in_chrome(self):
        webbrowser.open(self.current_url)

    def init_desktop_mockup(self):
        self.viewport.clear_widgets()
        card = PremiumCard(spacing=15, padding=30)
        
        title = Label(text="CampusX Web Portal Browser Overlay", font_size=16, bold=True, color=theme.primary)
        desc = Label(text=f"Requesting portal target: {self.current_url}", font_size=12, color=theme.text_main)
        info = Label(text="In desktop systems (Windows, macOS, Linux), we integrate directly with Google Chrome to provide native performance. Click below to view this portal session.", 
                     font_size=11, color=theme.text_subtle, halign='center')
        info.bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        btn = CustomButton(text="Launch Web Portal in Google Chrome", size_hint_y=None, height=45)
        btn.bind(on_release=lambda x: self.open_in_chrome())
        
        card.add_widget(title)
        card.add_widget(desc)
        card.add_widget(info)
        card.add_widget(btn)
        self.viewport.add_widget(card)

    def init_android_webview(self):
        """Native webview bindings for Android using PyJnius."""
        try:
            from jnius import autoclass
            PythonActivity = autoclass('org.kivy.android.PythonActivity')
            WebView = autoclass('android.webkit.WebView')
            WebViewClient = autoclass('android.webkit.WebViewClient')
            LayoutParams = autoclass('android.view.ViewGroup$LayoutParams')
            
            activity = PythonActivity.mActivity
            self.webview = WebView(activity)
            self.webview.getSettings().setJavaScriptEnabled(True)
            self.webview.setWebViewClient(WebViewClient())
            self.webview.loadUrl(self.current_url)
            
            activity.addContentView(self.webview, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
        except Exception as e:
            print(f"[Webview] Native load failed, fallback to desktop view: {e}")
            self.init_desktop_mockup()
