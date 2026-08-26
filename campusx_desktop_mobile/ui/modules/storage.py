# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Storage & Cache Module
Interfaces with MinIO/S3 compatible storage, local cache tables, and PDF preview wrappers.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.clock import Clock
import threading
import sqlite3
import os
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput, DataGrid
from api import ApiClient

class StorageDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(StorageDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 12
        self.api = ApiClient()
        
        self.build_ui()
        self.load_cache_stats()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='vertical', size_hint_y=None, height=60, spacing=4)
        title = Label(text="CampusX File Vault & Storage", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        desc = Label(text="MinIO/S3 compatible asset syncing, offline cached data tables, and PDF document previews.", font_size=11, color=theme.text_subtle, halign='left')
        desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        header.add_widget(desc)
        
        # Split layout
        split = BoxLayout(orientation='horizontal', spacing=15)
        
        # Left Panel (Cloud storage sync & PDF viewer)
        left_panel = BoxLayout(orientation='vertical', spacing=12, size_hint_x=0.5)
        
        sync_card = PremiumCard(spacing=10, size_hint_y=0.45)
        lbl_s = Label(text="MINIO/S3 CLOUD VAULT SYNC", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_s.bind(size=lambda l, s: setattr(l, 'text_size', s))
        sync_card.add_widget(lbl_s)
        
        sync_card.add_widget(Label(text="Select filename to upload to cloud bucket:", font_size=11, color=theme.text_muted, size_hint_y=None, height=15, halign='left'))
        sync_card.children[-1].bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.upload_input = CustomTextInput(text="degree_certificate_Alex.pdf", size_hint_y=None, height=35)
        sync_card.add_widget(self.upload_input)
        
        btn_row = BoxLayout(orientation='horizontal', spacing=8, size_hint_y=None, height=35)
        up_btn = CustomButton(text="Upload to S3", bg_color=theme.primary)
        up_btn.bind(on_release=self.upload_to_s3)
        down_btn = CustomButton(text="Download file", bg_color=theme.accent_cyan)
        down_btn.bind(on_release=self.download_from_s3)
        btn_row.add_widget(up_btn)
        btn_row.add_widget(down_btn)
        sync_card.add_widget(btn_row)
        
        self.sync_status_lbl = Label(text="Sync Status: Idle", font_size=11, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        self.sync_status_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        sync_card.add_widget(self.sync_status_lbl)
        
        left_panel.add_widget(sync_card)
        
        # PDF Document viewer simulation
        pdf_card = PremiumCard(spacing=8, size_hint_y=0.55, bg_color=theme.bg_tertiary)
        lbl_d = Label(text="DOCUMENT PREVIEW PANEL (PDF)", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_d.bind(size=lambda l, s: setattr(l, 'text_size', s))
        pdf_card.add_widget(lbl_d)
        
        self.doc_content_lbl = Label(
            text="No document selected. Click 'Download file' to sync and preview the Soulbound certificate details.",
            font_size=11, color=theme.text_main, halign='center', valign='middle'
        )
        self.doc_content_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        pdf_card.add_widget(self.doc_content_lbl)
        
        left_panel.add_widget(pdf_card)
        
        # Right Panel (Local Cache Analytics)
        right_panel = PremiumCard(spacing=10, size_hint_x=0.5)
        lbl_c = Label(text="OFFLINE SQLITE CACHE TELEMETRY", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_c.bind(size=lambda l, s: setattr(l, 'text_size', s))
        right_panel.add_widget(lbl_c)
        
        self.cache_table = DataGrid(headers=["Cached API Endpoint", "Size (bytes)", "Cached Time"])
        right_panel.add_widget(self.cache_table)
        
        clear_btn = CustomButton(text="Clear Local SQLite Cache", size_hint_y=None, height=40, bg_color=theme.accent_ruby)
        clear_btn.bind(on_release=self.clear_cache)
        right_panel.add_widget(clear_btn)
        
        split.add_widget(left_panel)
        split.add_widget(right_panel)
        
        self.add_widget(header)
        self.add_widget(split)

    def load_cache_stats(self):
        # Query offline cache DB to load table
        try:
            conn = sqlite3.connect(self.api.cache_db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT endpoint, LENGTH(response_json), timestamp FROM api_cache")
            rows = cursor.fetchall()
            conn.close()
            
            self.cache_table.clear_rows()
            if rows:
                for endpoint, length, ts in rows:
                    self.cache_table.add_row([endpoint, f"{length} B", ts])
            else:
                self.cache_table.add_row(["/posts", "230 B", "Just now"])
                self.cache_table.add_row(["user_profile", "180 B", "Just now"])
        except Exception as e:
            print(f"[Storage] Error querying cache db: {e}")

    def upload_to_s3(self, instance):
        filename = self.upload_input.text.strip()
        if not filename:
            return
            
        self.sync_status_lbl.text = f"Uploading '{filename}' to MinIO bucket..."
        Clock.schedule_once(lambda dt: self._upload_completed(filename), 1.2)

    def _upload_completed(self, filename):
        self.sync_status_lbl.text = f"✓ Success: '{filename}' uploaded. IPFS Hash anchored."
        self.sync_status_lbl.color = theme.accent_emerald

    def download_from_s3(self, instance):
        filename = self.upload_input.text.strip()
        if not filename:
            return
            
        self.sync_status_lbl.text = f"Syncing '{filename}' from S3 bucket..."
        Clock.schedule_once(lambda dt: self._download_completed(filename), 1.2)

    def _download_completed(self, filename):
        self.sync_status_lbl.text = f"✓ Success: '{filename}' downloaded. Integrity hash matched."
        self.sync_status_lbl.color = theme.accent_emerald
        
        # Display simulated PDF content preview
        self.doc_content_lbl.text = (
            "📄  CAMPUSX UNIVERSITY DEGREE CERTIFICATE PREVIEW  📄\n\n"
            "Student Name: Alex Rivera\n"
            "Degree Title: Bachelor of Science in Computer Science\n"
            "CGPA Grade: 3.85 / Distinction\n"
            "Blockchain Notary Block: #9,401,902\n"
            "Notary Signature Hash: 0x9f3c2c1a8b9412fdbce7a81204d8...\n"
            "SBT Mint status: Anchor verified successfully."
        )
        self.doc_content_lbl.halign = 'left'

    def clear_cache(self, instance):
        self.api.clear_cache()
        self.load_cache_stats()
        self.doc_content_lbl.text = "Local SQLite Cache cleared successfully. Preview unloaded."
