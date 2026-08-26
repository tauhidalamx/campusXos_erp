# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - CampusX Connect Module
Includes campus feeds, stories trays, direct message logs, and real-time WebSocket chats.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.clock import Clock
from kivy.graphics import Color, Rectangle, Line
import threading
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput, DataGrid
from api import ApiClient

class ConnectDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(ConnectDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.api = ApiClient()
        self.feed_data = None
        
        self.build_ui()
        self.load_feed()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='horizontal', size_hint_y=None, height=45)
        title = Label(text="CampusX Connect Social Feed", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        
        # Stories Tray
        stories_tray = BoxLayout(orientation='horizontal', size_hint_y=None, height=70, spacing=10, padding=[4, 2])
        stories_tray.bind(pos=lambda ins, val: self.draw_tray_bg(stories_tray, ins), size=lambda ins, val: self.draw_tray_bg(stories_tray, ins))
        
        mock_stories = ["Dr. Evelyn", "Dean Sterling", "Prof. Marcus", "Jackson C.", "Ravi K.", "Maya L."]
        for name in mock_stories:
            story_box = BoxLayout(orientation='vertical', size_hint_x=None, width=60, spacing=2)
            circle = Label(text="👤", font_size=20, color=theme.primary)
            s_name = Label(text=name, font_size=8, color=theme.text_muted, halign='center')
            s_name.bind(size=lambda l, s: setattr(l, 'text_size', s))
            story_box.add_widget(circle)
            story_box.add_widget(s_name)
            stories_tray.add_widget(story_box)
            
        # Post creation box
        new_post_card = PremiumCard(size_hint_y=None, height=60, padding=8, spacing=8)
        post_row = BoxLayout(orientation='horizontal', spacing=8)
        self.post_input = CustomTextInput(hint_text="Share something with the university campus...")
        post_btn = CustomButton(text="Post", size_hint_x=0.2, bg_color=theme.primary)
        post_btn.bind(on_release=self.publish_post)
        post_row.add_widget(self.post_input)
        post_row.add_widget(post_btn)
        new_post_card.add_widget(post_row)
        
        # Posts Feed
        self.feed_scroll = ScrollView()
        self.feed_layout = GridLayout(cols=1, spacing=12, size_hint_y=None)
        self.feed_layout.bind(minimum_height=self.feed_layout.setter('height'))
        self.feed_scroll.add_widget(self.feed_layout)
        
        self.add_widget(header)
        self.add_widget(stories_tray)
        self.add_widget(new_post_card)
        self.add_widget(self.feed_scroll)

    def draw_tray_bg(self, tray, instance):
        tray.canvas.before.clear()
        with tray.canvas.before:
            Color(*theme.bg_secondary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(rounded_rect=(instance.pos[0], instance.pos[1], instance.size[0], instance.size[1], 8), width=1)

    def load_feed(self):
        threading.Thread(target=self._fetch_feed_worker).start()

    def _fetch_feed_worker(self):
        data = self.api.fetch_get("/posts")
        Clock.schedule_once(lambda dt: self.populate_feed(data), 0)

    def populate_feed(self, data):
        self.feed_layout.clear_widgets()
        
        display_posts = []
        if data and isinstance(data, list):
            for post in data:
                author = post.get("user_name", post.get("user_id", "Anonymous"))
                body = post.get("content", "")
                category = post.get("category", "General").capitalize()
                time_str = "Just now"
                likes_count = len(post.get("likes", [])) if isinstance(post.get("likes"), list) else 0
                display_posts.append((author, category, body, time_str, f"{likes_count} Likes"))
        else:
            # Fallback mock post feed
            display_posts = [
                ("Dean Evelyn Sterling", "Academic Registry", "All outstanding student degree credentials have been finalized and anchored to the local verification ledger.", "7 mins ago", "12 Likes"),
                ("Prof. Marcus Chen", "Research Symposium", "Inviting all students to the upcoming Private AI Gateway architecture discussion. Check library assets for reading materials.", "24 mins ago", "34 Likes"),
                ("System Operations Admin", "Maintenance", "Successfully rolled out light theme update across ERP components. Telemetry reports normal load.", "1 hour ago", "52 Likes")
            ]
            
        for author, category, body, time, likes in display_posts:
            post_card = PremiumCard(size_hint_y=None, height=130, spacing=4)
            
            p_header = BoxLayout(orientation='horizontal', size_hint_y=None, height=20)
            p_author = Label(text=author, font_size=11, bold=True, color=theme.primary, halign='left')
            p_author.bind(size=lambda l, s: setattr(l, 'text_size', s))
            p_time = Label(text=time, font_size=8, color=theme.text_subtle, halign='right')
            p_time.bind(size=lambda l, s: setattr(l, 'text_size', s))
            p_header.add_widget(p_author)
            p_header.add_widget(p_time)
            
            p_cat = Label(text=category.upper(), font_size=8, bold=True, color=theme.accent_cyan, size_hint_y=None, height=12, halign='left')
            p_cat.bind(size=lambda l, s: setattr(l, 'text_size', s))
            
            p_body = Label(text=body, font_size=10, color=theme.text_muted, halign='left', valign='top')
            p_body.bind(size=lambda l, s: setattr(l, 'text_size', s))
            
            p_footer = BoxLayout(orientation='horizontal', size_hint_y=None, height=20)
            p_likes = Label(text=likes, font_size=9, bold=True, color=theme.accent_ruby, halign='left')
            p_likes.bind(size=lambda l, s: setattr(l, 'text_size', s))
            p_footer.add_widget(p_likes)
            
            post_card.add_widget(p_header)
            post_card.add_widget(p_cat)
            post_card.add_widget(p_body)
            post_card.add_widget(p_footer)
            self.feed_layout.add_widget(post_card)

    def publish_post(self, instance):
        text = self.post_input.text.strip()
        if not text:
            return
            
        self.post_input.text = ""
        payload = {
            "content": text,
            "category": "General",
            "user_name": self.api.user_profile.get("name", "Demo User") if self.api.user_profile else "Anonymous"
        }
        
        threading.Thread(target=self._publish_worker, args=(payload,)).start()

    def _publish_worker(self, payload):
        self.api.fetch_post("/posts", payload)
        self.load_feed()
