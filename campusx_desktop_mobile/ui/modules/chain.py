# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - CampusX Chain Module
Includes academic SBT wallet balances, block explorers, and cryptographic credential verifications.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.clock import Clock
import hashlib
import threading
from ui.theme import theme
from ui.components import PremiumCard, CustomButton, CustomTextInput, DataGrid
from api import ApiClient

class ChainDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(ChainDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 12
        self.api = ApiClient()
        
        self.build_ui()
        self.load_data()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='vertical', size_hint_y=None, height=60, spacing=4)
        title = Label(text="CampusX Chain Terminal Ledger", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        desc = Label(text="Verifiable academic credentials, on-chain SBT mints, and distributed ledger audits.", font_size=11, color=theme.text_subtle, halign='left')
        desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        header.add_widget(desc)
        
        # Top Stats
        top_stats = GridLayout(cols=3, spacing=15, size_hint_y=None, height=70)
        stats = [
            ("LATEST ANCHOR BLOCK", "Block #9,401,922", theme.accent_cyan),
            ("PEER CONVERGENCE NODES", "5 Active Validators", theme.accent_emerald),
            ("CONSENSUS SPEED", "45 TPS / 22ms latency", theme.primary)
        ]
        for name, value, col in stats:
            card = PremiumCard(border_color=col, padding=8, spacing=2)
            n_lbl = Label(text=name, font_size=9, color=theme.text_subtle, halign='left')
            n_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            v_lbl = Label(text=value, font_size=13, bold=True, color=theme.text_main, halign='left')
            v_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            card.add_widget(n_lbl)
            card.add_widget(v_lbl)
            top_stats.add_widget(card)
            
        # Split layout
        split_layout = BoxLayout(orientation='horizontal', spacing=15)
        
        # Left Panel (Credential Verifier)
        left_panel = PremiumCard(spacing=10, size_hint_x=0.45)
        lbl_v = Label(text="SBT CREDENTIAL HASH VERIFIER", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_v.bind(size=lambda l, s: setattr(l, 'text_size', s))
        left_panel.add_widget(lbl_v)
        
        left_panel.add_widget(Label(text="Enter Soulbound Token (SBT) Certificate Hash:", font_size=11, color=theme.text_muted, size_hint_y=None, height=15, halign='left'))
        left_panel.children[-1].bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        self.hash_input = CustomTextInput(hint_text="e.g. 0x9f3c...14da", size_hint_y=None, height=35)
        left_panel.add_widget(self.hash_input)
        
        verify_btn = CustomButton(text="Verify On-Chain Integrity", size_hint_y=None, height=40, bg_color=theme.primary)
        verify_btn.bind(on_release=self.verify_hash)
        left_panel.add_widget(verify_btn)
        
        self.verif_card = PremiumCard(size_hint_y=None, height=110, bg_color=theme.bg_tertiary, padding=10, spacing=4)
        self.v_title = Label(text="VERIFICATION AUDIT TELEMETRY", font_size=10, bold=True, color=theme.text_subtle, halign='left')
        self.v_title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.v_status = Label(text="Status: Idle", font_size=12, bold=True, color=theme.text_main, halign='left')
        self.v_status.bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.v_details = Label(text="Submit a grade or degree hash for blockchain ledger inspection.", font_size=9, color=theme.text_muted, halign='left')
        self.v_details.bind(size=lambda l, s: setattr(l, 'text_size', s))
        
        self.verif_card.add_widget(self.v_title)
        self.verif_card.add_widget(self.v_status)
        self.verif_card.add_widget(self.v_details)
        left_panel.add_widget(self.verif_card)
        left_panel.add_widget(BoxLayout(size_hint_y=0.1)) # Spacer
        
        # Right Panel (Block Ledger Explorer)
        right_panel = PremiumCard(spacing=8, size_hint_x=0.55)
        lbl_e = Label(text="BLOCK TRANSACTION EXPLORER", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_e.bind(size=lambda l, s: setattr(l, 'text_size', s))
        right_panel.add_widget(lbl_e)
        
        self.tx_table = DataGrid(headers=["Tx Hash", "Anchored Action", "Node Verdict"])
        right_panel.add_widget(self.tx_table)
        
        split_layout.add_widget(left_panel)
        split_layout.add_widget(right_panel)
        
        self.add_widget(header)
        self.add_widget(top_stats)
        self.add_widget(split_layout)

    def load_data(self):
        # Populate live blocks register
        self.populate_blocks()

    def populate_blocks(self):
        self.tx_table.clear_rows()
        mock_txs = [
            ("0x9f3c...14da", "SBT Degree Mint [STU006 PATEL]", "✓ SUCCESS"),
            ("0x82b5...904b", "Research IP Anchorage [DEAN EVELYN]", "✓ SUCCESS"),
            ("0x4f12...eef8", "SSO Key Rotation Auth [COE ALPHA]", "✓ SUCCESS"),
            ("0x117a...35c8", "Smart Contract Deploy [ExamAlloc.sol]", "✓ SUCCESS"),
            ("0x7e8b...29ab", "Fee Clearance receipt Hash [STU001]", "✓ SUCCESS")
        ]
        for tx, action, verdict in mock_txs:
            self.tx_table.add_row([tx, action, verdict])

    def verify_hash(self, instance):
        input_hash = self.hash_input.text.strip()
        if not input_hash:
            return
            
        self.v_status.text = "Searching Block Headers..."
        self.v_details.text = "Querying distributed validators consensus..."
        
        # Simulate on-chain checks
        Clock.schedule_once(lambda dt: self._verify_completed(input_hash), 1.0)

    def _verify_completed(self, h):
        # Mock cryptographic checks matching default logs
        if h.startswith("0x"):
            self.v_status.text = "Status: ✓ INTEGRITY VERIFIED (BLOCK SECURE)"
            self.v_status.color = theme.accent_emerald
            self.verif_card.border_color = theme.accent_emerald
            self.v_details.text = f"Signature Match. Anchored in block #9,401,902.\nHash matching: {hashlib.sha256(h.encode()).hexdigest()[:24]}..."
        else:
            self.v_status.text = "Status: ⚠ INTEGRITY VERIFICATION FAILED"
            self.v_status.color = theme.accent_ruby
            self.verif_card.border_color = theme.accent_ruby
            self.v_details.text = "Error: Hash matches no registered blocks header.\nThe transaction has been flagged as altered or un-anchored."
