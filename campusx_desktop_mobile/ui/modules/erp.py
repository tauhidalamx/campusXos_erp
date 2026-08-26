# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - ERP Operations Module
Features dynamic sub-tabs for operations dashboards, rosters, attendance, finance, and decentralized results.
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

class ErpDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(ErpDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.api = ApiClient()
        
        # Sub-tab bar
        self.tab_bar = BoxLayout(orientation='horizontal', size_hint_y=None, height=35, spacing=5)
        self.tabs = {}
        tab_names = [
            ("dashboard", "Operations Dashboard"),
            ("rosters", "Rosters & Admissions"),
            ("attendance", "Class Attendance"),
            ("finance", "Finance & Invoices"),
            ("results", "Results & SBTs")
        ]
        
        for key, label in tab_names:
            btn = CustomButton(text=label, size_hint_x=0.2, bg_color=theme.bg_tertiary, text_color=theme.text_muted)
            btn.bind(on_release=lambda x, k=key: self.switch_tab(k))
            self.tab_bar.add_widget(btn)
            self.tabs[key] = btn
            
        self.add_widget(self.tab_bar)
        
        # Sub-viewport container
        self.viewport = BoxLayout(orientation='vertical')
        self.add_widget(self.viewport)
        
        theme.register_listener(self.on_theme_changed)
        self.switch_tab("dashboard")

    def on_theme_changed(self):
        self.switch_tab(self.active_tab)

    def switch_tab(self, tab_key):
        self.active_tab = tab_key
        
        # Reset button highlights
        for key, btn in self.tabs.items():
            btn.bg_color = theme.primary if key == tab_key else theme.bg_tertiary
            btn.color = [1, 1, 1, 1] if key == tab_key else theme.text_muted
            
        self.viewport.clear_widgets()
        
        if tab_key == "dashboard":
            self.render_dashboard()
        elif tab_key == "rosters":
            self.render_rosters()
        elif tab_key == "attendance":
            self.render_attendance()
        elif tab_key == "finance":
            self.render_finance()
        elif tab_key == "results":
            self.render_results()

    # --- 1. OPERATIONS DASHBOARD ---
    def render_dashboard(self):
        grid = GridLayout(cols=4, spacing=12, size_hint_y=None, height=80)
        kpis = [
            ("TENANTS SYNCHRONIZED", "12 Universities", theme.accent_emerald),
            ("K8S CLUSTER HEALTH", "Healthy Mesh", theme.accent_cyan),
            ("GLOBAL AI SERVER LOAD", "84% Capacity", theme.accent_amber),
            ("SECURITY INCIDENTS", "0 Logged", theme.accent_ruby)
        ]
        for name, val, col in kpis:
            card = PremiumCard(border_color=col, padding=8, spacing=2)
            n = Label(text=name, font_size=8, color=theme.text_subtle, halign='left')
            n.bind(size=lambda l, s: setattr(l, 'text_size', s))
            v = Label(text=val, font_size=13, bold=True, color=theme.text_main, halign='left')
            v.bind(size=lambda l, s: setattr(l, 'text_size', s))
            card.add_widget(n)
            card.add_widget(v)
            grid.add_widget(card)
            
        lower = BoxLayout(orientation='horizontal', spacing=12)
        
        # Kubernetes pods monitoring
        pods_card = PremiumCard(spacing=8, size_hint_x=0.55)
        lbl_p = Label(text="KUBERNETES RUNTIME POD STATUS", font_size=10, bold=True, color=theme.text_muted, size_hint_y=None, height=18, halign='left')
        lbl_p.bind(size=lambda l, s: setattr(l, 'text_size', s))
        pods_card.add_widget(lbl_p)
        
        pods_table = DataGrid(headers=["Pod Name", "Status", "CPU", "Memory"])
        mock_pods = [
            ("campusx-core-api-84f5d", "Running", "12%", "256MB"),
            ("campusx-connect-webrtc-8a7e3", "Running", "48%", "812MB"),
            ("campusx-ai-copilot-model-c7b9", "Running", "94%", "2.4GB"),
            ("campusx-postgresql-primary-0", "Online", "15%", "1.2GB")
        ]
        for name, status, cpu, memory in mock_pods:
            pods_table.add_row([name, status, cpu, memory])
        pods_card.add_widget(pods_table)
        
        # System audit logs
        logs_card = PremiumCard(spacing=8, size_hint_x=0.45)
        lbl_l = Label(text="SYSTEM AUDIT LOG REGISTER", font_size=10, bold=True, color=theme.text_muted, size_hint_y=None, height=18, halign='left')
        lbl_l.bind(size=lambda l, s: setattr(l, 'text_size', s))
        logs_card.add_widget(lbl_l)
        
        logs_table = DataGrid(headers=["Log Event", "Operator ID", "IP Address"])
        mock_logs = [
            ("K8s Cluster Scale Up", "superadmin@campusx.demo", "10.244.0.1"),
            ("Degree SBT Minted", "registrar@campusx.demo", "192.168.12.4"),
            ("New Faculty Enrolled", "admin@campusx.demo", "192.168.1.10")
        ]
        for ev, op, ip in mock_logs:
            logs_table.add_row([ev, op, ip])
        logs_card.add_widget(logs_table)
        
        lower.add_widget(pods_card)
        lower.add_widget(logs_card)
        
        self.viewport.add_widget(grid)
        self.viewport.add_widget(BoxLayout(size_hint_y=None, height=10))
        self.viewport.add_widget(lower)

    # --- 2. ROSTERS & ADMISSIONS ---
    def render_rosters(self):
        split = BoxLayout(orientation='horizontal', spacing=12)
        
        # Student directory
        stud_card = PremiumCard(spacing=8, size_hint_x=0.55)
        lbl_s = Label(text="STUDENT DIRECTORY LIST", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_s.bind(size=lambda l, s: setattr(l, 'text_size', s))
        stud_card.add_widget(lbl_s)
        
        self.stud_table = DataGrid(headers=["User ID", "Full Name", "Email Roster", "Dept"])
        stud_card.add_widget(self.stud_table)
        
        # Admissions pending approvals
        adm_card = PremiumCard(spacing=8, size_hint_x=0.45)
        lbl_a = Label(text="PENDING ADMISSIONS REGISTRY", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_a.bind(size=lambda l, s: setattr(l, 'text_size', s))
        adm_card.add_widget(lbl_a)
        
        self.adm_table = DataGrid(headers=["Applicant Name", "Branch Choice", "Status"])
        adm_card.add_widget(self.adm_table)
        
        split.add_widget(stud_card)
        split.add_widget(adm_card)
        self.viewport.add_widget(split)
        
        # Fetch rosters
        threading.Thread(target=self._fetch_rosters_worker).start()

    def _fetch_rosters_worker(self):
        users = self.api.fetch_get("/users")
        adms = self.api.fetch_get("/admissions/applications")
        Clock.schedule_once(lambda dt: self._populate_rosters(users, adms), 0)

    def _populate_rosters(self, users, adms):
        if hasattr(self, 'stud_table'):
            self.stud_table.clear_rows()
            if users and isinstance(users, list):
                for u in users:
                    if u.get("role") == "student":
                        self.stud_table.add_row([u.get("id"), u.get("name"), u.get("email"), u.get("department", "CS")])
            else:
                self.stud_table.add_row(["STU001", "Alex Rivera", "alex@campusx.edu", "Computer Science"])
                self.stud_table.add_row(["STU002", "Priya Nair", "priya@campusx.edu", "Data Science"])
                
        if hasattr(self, 'adm_table'):
            self.adm_table.clear_rows()
            if adms and isinstance(adms, list):
                for a in adms:
                    self.adm_table.add_row([a.get("name"), a.get("department", "CS"), a.get("status")])
            else:
                self.adm_table.add_row(["Alice Johnson", "Computer Science", "Approved"])
                self.adm_table.add_row(["Bob Smith", "Data Analytics", "Pending"])

    # --- 3. CLASS ATTENDANCE ---
    def render_attendance(self):
        card = PremiumCard(spacing=10)
        lbl = Label(text="MARK ATTENDANCE ROSTER", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        card.add_widget(lbl)
        
        self.attn_table = DataGrid(headers=["Student ID", "Name", "Date Logged", "Status Selection"])
        card.add_widget(self.attn_table)
        
        # Roster marking controls
        form = BoxLayout(orientation='horizontal', size_hint_y=None, height=45, spacing=8)
        self.attn_student_input = CustomTextInput(hint_text="Student ID (e.g. STU001)")
        self.attn_status_input = CustomTextInput(hint_text="Status (PRESENT/ABSENT)")
        
        mark_btn = CustomButton(text="Log Attendance", size_hint_x=0.25, bg_color=theme.accent_cyan)
        mark_btn.bind(on_release=self.log_attendance)
        form.add_widget(self.attn_student_input)
        form.add_widget(self.attn_status_input)
        form.add_widget(mark_btn)
        
        card.add_widget(form)
        self.viewport.add_widget(card)
        self.load_attendance_records()

    def load_attendance_records(self):
        threading.Thread(target=self._fetch_attn_worker).start()

    def _fetch_attn_worker(self):
        recs = self.api.fetch_get("/attendance")
        Clock.schedule_once(lambda dt: self._populate_attn(recs), 0)

    def _populate_attn(self, data):
        self.attn_table.clear_rows()
        if data and isinstance(data, list):
            for row in data:
                self.attn_table.add_row([row.get("studentId", "STU001"), "Student", row.get("date", "")[:10], row.get("status")])
        else:
            self.attn_table.add_row(["STU001", "Alex Rivera", "2026-07-15", "PRESENT"])
            self.attn_table.add_row(["STU002", "Priya Nair", "2026-07-15", "ABSENT"])

    def log_attendance(self, instance):
        sid = self.attn_student_input.text.strip()
        status = self.attn_status_input.text.upper().strip()
        if not sid or not status:
            return
            
        self.attn_student_input.text = ""
        self.attn_status_input.text = ""
        
        payload = {
            "studentId": sid,
            "courseCode": "CS202",
            "date": "2026-07-15",
            "status": status,
            "method": "MOBILE"
        }
        threading.Thread(target=self._post_attn_worker, args=(payload,)).start()

    def _post_attn_worker(self, payload):
        self.api.fetch_post("/attendance", payload)
        self.load_attendance_records()

    # --- 4. FINANCE & INVOICES ---
    def render_finance(self):
        split = BoxLayout(orientation='horizontal', spacing=12)
        
        payments_card = PremiumCard(spacing=8, size_hint_x=0.55)
        lbl_p = Label(text="STRIPE COLLECTION PAYMENT DIRECTORY", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_p.bind(size=lambda l, s: setattr(l, 'text_size', s))
        payments_card.add_widget(lbl_p)
        
        self.payments_table = DataGrid(headers=["Receipt ID", "Student ID", "Amount Cleared", "Stripe Status"])
        payments_card.add_widget(self.payments_table)
        
        invoice_card = PremiumCard(spacing=8, size_hint_x=0.45)
        lbl_i = Label(text="INSTALLMENT PENALTY ALERTS", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_i.bind(size=lambda l, s: setattr(l, 'text_size', s))
        invoice_card.add_widget(lbl_i)
        
        self.invoice_table = DataGrid(headers=["Due Date", "Fee Type", "Owed Value"])
        invoice_card.add_widget(self.invoice_table)
        
        split.add_widget(payments_card)
        split.add_widget(invoice_card)
        self.viewport.add_widget(split)
        
        self.load_finance_data()

    def load_finance_data(self):
        # Mock Stripe collection records matching schema FeeClearance/Installment
        self.payments_table.clear_rows()
        self.payments_table.add_row(["PAY-8120", "STU001", "$1,450.00", "SUCCESS"])
        self.payments_table.add_row(["PAY-8121", "STU002", "$1,250.00", "PENDING"])
        self.payments_table.add_row(["PAY-8122", "STU003", "$1,450.00", "SUCCESS"])
        
        self.invoice_table.clear_rows()
        self.invoice_table.add_row(["2026-08-01", "Tuition Fee", "$1,450.00"])
        self.invoice_table.add_row(["2026-08-15", "Hostel Fee", "$650.00"])

    # --- 5. RESULTS & SBTS ---
    def render_results(self):
        split = BoxLayout(orientation='horizontal', spacing=12)
        
        eval_card = PremiumCard(spacing=8, size_hint_x=0.55)
        lbl_e = Label(text="ACADEMIC EVALUATIONS ROSTER", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_e.bind(size=lambda l, s: setattr(l, 'text_size', s))
        eval_card.add_widget(lbl_e)
        
        self.eval_table = DataGrid(headers=["Student ID", "Subject", "Score", "Blockchain SBT status"])
        eval_card.add_widget(self.eval_table)
        
        action_card = PremiumCard(spacing=10, size_hint_x=0.45)
        lbl_a = Label(text="SBT DEGREE MINT DESK (REGISTRAR)", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_a.bind(size=lambda l, s: setattr(l, 'text_size', s))
        action_card.add_widget(lbl_a)
        
        action_card.add_widget(Label(text="Select Student ID to mint SBT Degree:", font_size=11, color=theme.text_muted, size_hint_y=None, height=15, halign='left'))
        action_card.children[-1].bind(size=lambda l, s: setattr(l, 'text_size', s))
        self.sbt_student_input = CustomTextInput(text="STU001", size_hint_y=None, height=35)
        action_card.add_widget(self.sbt_student_input)
        
        mint_btn = CustomButton(text="Mint Soulbound Token", size_hint_y=None, height=45, bg_color=theme.primary)
        mint_btn.bind(on_release=self.mint_degree_sbt)
        action_card.add_widget(mint_btn)
        
        self.sbt_result_lbl = Label(text="Tx Status: Idle", font_size=11, color=theme.text_muted, size_hint_y=None, height=25, halign='left')
        self.sbt_result_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        action_card.add_widget(self.sbt_result_lbl)
        action_card.add_widget(BoxLayout(size_hint_y=0.1))
        
        split.add_widget(eval_card)
        split.add_widget(action_card)
        self.viewport.add_widget(split)
        
        self.load_evaluations()

    def load_evaluations(self):
        self.eval_table.clear_rows()
        self.eval_table.add_row(["STU001", "CS202 DSA", "94.0%", "ISSUED"])
        self.eval_table.add_row(["STU002", "CS202 DSA", "83.0%", "ISSUED"])
        self.eval_table.add_row(["STU003", "EE101 ELEC", "74.0%", "PENDING"])

    def mint_degree_sbt(self, instance):
        sid = self.sbt_student_input.text.strip()
        if not sid:
            return
            
        self.sbt_result_lbl.text = "Authorizing smart contract signature..."
        # Call NestJS blockchain sbt mint endpoint mockup
        Clock.schedule_once(lambda dt: self._mint_sbt_completed(sid), 1.2)

    def _mint_sbt_completed(self, sid):
        import random
        tx_hash = "0x" + "".join([random.choice("0123456789abcdef") for _ in range(40)])
        self.sbt_result_lbl.text = f"SBT Minted!\nTx Hash: {tx_hash[:18]}..."
        self.sbt_result_lbl.color = theme.accent_emerald
