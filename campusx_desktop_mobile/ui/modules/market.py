# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - CampusX Market Module
Includes ticker watchlists, paper trading simulation, and quant prediction gauges.
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

class MarketDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(MarketDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 12
        self.api = ApiClient()
        
        # Portfolio virtual state
        self.portfolio_balance = 100000.0
        self.holdings = {"CAMPUSX": 12.0, "INFRA": 50.0}
        self.market_prices = {
            "CAMPUSX": 1450.22,
            "INFRA": 102.15,
            "YIELD": 342.88,
            "VAULT": 280.00
        }
        
        self.build_ui()
        self.load_data()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        
        # Header
        header = BoxLayout(orientation='vertical', size_hint_y=None, height=60, spacing=4)
        title = Label(text="Quant Forecast & Market Desk", font_size=18, bold=True, color=theme.text_main, halign='left')
        title.bind(size=lambda l, s: setattr(l, 'text_size', s))
        desc = Label(text="Campus index tokens, paper trading simulator, and machine learning trend predictions.", font_size=11, color=theme.text_subtle, halign='left')
        desc.bind(size=lambda l, s: setattr(l, 'text_size', s))
        header.add_widget(title)
        header.add_widget(desc)
        
        # Split container
        split_layout = BoxLayout(orientation='horizontal', spacing=15)
        
        # Left Panel (Watchlist and Sentiment Forecasts)
        left_panel = BoxLayout(orientation='vertical', spacing=12, size_hint_x=0.55)
        
        watchlist_card = PremiumCard(spacing=8)
        lbl_w = Label(text="LIVE TICKER WATCHLIST & ML FORECAST", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_w.bind(size=lambda l, s: setattr(l, 'text_size', s))
        watchlist_card.add_widget(lbl_w)
        
        self.watchlist_table = DataGrid(headers=["Ticker Symbol", "Price", "Change", "ML Trend Forecast"])
        watchlist_card.add_widget(self.watchlist_table)
        left_panel.add_widget(watchlist_card)
        
        # Right Panel (Paper Trading and Portfolio Tracker)
        right_panel = BoxLayout(orientation='vertical', spacing=12, size_hint_x=0.45)
        
        portfolio_card = PremiumCard(spacing=10, size_hint_y=0.45)
        lbl_p = Label(text="PAPER TRADING SIMULATION", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_p.bind(size=lambda l, s: setattr(l, 'text_size', s))
        portfolio_card.add_widget(lbl_p)
        
        self.bal_lbl = Label(text=f"Simulated Cash: ${self.portfolio_balance:,.2f} USD", font_size=14, bold=True, color=theme.primary, size_hint_y=None, height=25, halign='left')
        self.bal_lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
        portfolio_card.add_widget(self.bal_lbl)
        
        # Order forms
        form_row = BoxLayout(orientation='horizontal', spacing=8, size_hint_y=None, height=35)
        self.symbol_input = CustomTextInput(hint_text="Ticker Symbol (CAMPUSX)")
        self.qty_input = CustomTextInput(hint_text="Quantity (1.0)")
        form_row.add_widget(self.symbol_input)
        form_row.add_widget(self.qty_input)
        portfolio_card.add_widget(form_row)
        
        action_row = BoxLayout(orientation='horizontal', spacing=8, size_hint_y=None, height=35)
        buy_btn = CustomButton(text="Buy Asset", bg_color=theme.accent_emerald)
        buy_btn.bind(on_release=self.execute_buy)
        sell_btn = CustomButton(text="Sell Asset", bg_color=theme.accent_ruby)
        sell_btn.bind(on_release=self.execute_sell)
        action_row.add_widget(buy_btn)
        action_row.add_widget(sell_btn)
        portfolio_card.add_widget(action_row)
        
        right_panel.add_widget(portfolio_card)
        
        # Holdings Tracker
        holdings_card = PremiumCard(spacing=8, size_hint_y=0.55)
        lbl_h = Label(text="PORTFOLIO HOLDINGS LEDGER", font_size=11, bold=True, color=theme.text_muted, size_hint_y=None, height=20, halign='left')
        lbl_h.bind(size=lambda l, s: setattr(l, 'text_size', s))
        holdings_card.add_widget(lbl_h)
        
        self.holdings_table = DataGrid(headers=["Hold Asset", "Qty Owned", "Current Value"])
        holdings_card.add_widget(self.holdings_table)
        right_panel.add_widget(holdings_card)
        
        split_layout.add_widget(left_panel)
        split_layout.add_widget(right_panel)
        
        self.add_widget(header)
        self.add_widget(split_layout)

    def load_data(self):
        threading.Thread(target=self._fetch_quotes_worker).start()
        self.update_holdings_table()

    def _fetch_quotes_worker(self):
        quotes = self.api.fetch_get("/market/quotes")
        Clock.schedule_once(lambda dt: self.populate_quotes(quotes), 0)

    def populate_quotes(self, data):
        self.watchlist_table.clear_rows()
        
        display_tickers = []
        if data and isinstance(data, dict) and "quotes" in data:
            quotes = data["quotes"]
            for symbol, quote in quotes.items():
                name = quote.get("name", symbol)
                price = f"${quote.get('price', 0.0):.2f}"
                change = quote.get("change", 0.0)
                pct = quote.get("pct", 0.0)
                trend = f"{'+' if change >= 0 else ''}{change:.2f} ({pct:+.2f}%)"
                forecast = quote.get("sentiment", "HOLD")
                display_tickers.append((symbol, price, trend, forecast))
        else:
            # Fallback ticker listings
            display_tickers = [
                ("CAMPUSX", "$1,450.22", "+4.25% Uptrend", "STRONG BUY"),
                ("INFRA", "$102.15", "+0.12% Stable", "HOLD"),
                ("YIELD", "$342.88", "-1.48% Correction", "BUY"),
                ("VAULT", "$280.00", "+18.4% Breakthrough", "STRONG BUY")
            ]
            
        for sym, price, change, fc in display_tickers:
            self.watchlist_table.add_row([sym, price, change, fc])

    def update_holdings_table(self):
        self.holdings_table.clear_rows()
        for symbol, qty in self.holdings.items():
            if qty <= 0:
                continue
            price = self.market_prices.get(symbol, 100.0)
            value = price * qty
            self.holdings_table.add_row([symbol, f"{qty:.2f}", f"${value:,.2f}"])

    def execute_buy(self, instance):
        sym = self.symbol_input.text.upper().strip()
        qty_str = self.qty_input.text.strip()
        if not sym or not qty_str:
            return
        try:
            qty = float(qty_str)
        except ValueError:
            return
            
        price = self.market_prices.get(sym, 100.0)
        total_cost = price * qty
        if self.portfolio_balance >= total_cost:
            self.portfolio_balance -= total_cost
            self.holdings[sym] = self.holdings.get(sym, 0.0) + qty
            
            # Post transaction to backend API
            payload = {
                "symbol": sym,
                "assetType": "STOCK",
                "type": "BUY",
                "quantity": qty,
                "price": price,
                "notes": "Purchased via Kivy Client desk"
            }
            threading.Thread(target=lambda: self.api.fetch_post("/market/portfolio/trade", payload)).start()
            
            self.bal_lbl.text = f"Simulated Cash: ${self.portfolio_balance:,.2f} USD"
            self.update_holdings_table()
            self.symbol_input.text = ""
            self.qty_input.text = ""

    def execute_sell(self, instance):
        sym = self.symbol_input.text.upper().strip()
        qty_str = self.qty_input.text.strip()
        if not sym or not qty_str:
            return
        try:
            qty = float(qty_str)
        except ValueError:
            return
            
        current_qty = self.holdings.get(sym, 0.0)
        if current_qty >= qty:
            price = self.market_prices.get(sym, 100.0)
            revenue = price * qty
            self.portfolio_balance += revenue
            self.holdings[sym] = current_qty - qty
            
            # Post transaction to backend API
            payload = {
                "symbol": sym,
                "assetType": "STOCK",
                "type": "SELL",
                "quantity": qty,
                "price": price,
                "notes": "Sold via Kivy Client desk"
            }
            threading.Thread(target=lambda: self.api.fetch_post("/market/portfolio/trade", payload)).start()
            
            self.bal_lbl.text = f"Simulated Cash: ${self.portfolio_balance:,.2f} USD"
            self.update_holdings_table()
            self.symbol_input.text = ""
            self.qty_input.text = ""
            
            if self.holdings[sym] == 0:
                del self.holdings[sym]
