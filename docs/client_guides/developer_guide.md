# CAMPUSX OS Kivy Client - Developer Guide

This document helps developers extend the CAMPUSX OS Kivy client application. It covers creating new pages, connecting to APIs, and drawing custom canvas elements.

---

## 1. Creating a New UI Module

To add a new super-app module (e.g. `ResearchDashboard`):

1. Create a new python file under `ui/modules/research.py`.
2. Inherit from Kivy's `BoxLayout` and import `theme`:

```python
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from ui.theme import theme
from ui.components import PremiumCard

class ResearchDashboard(BoxLayout):
    def __init__(self, **kwargs):
        super(ResearchDashboard, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 10
        self.build_ui()
        theme.register_listener(self.build_ui)

    def build_ui(self):
        self.clear_widgets()
        card = PremiumCard(spacing=8)
        card.add_widget(Label(text="Research Assets", color=theme.text_main))
        self.add_widget(card)
```

3. Register your module in `ui/dashboard.py` within `navs` list and the `switch_module` function:

```python
# In ui/dashboard.py:
navs = [
    # ...
    ("research", "🔬 Research Assets")
]

# In switch_module(self, mod_key):
elif mod_key == "research":
    from ui.modules.research import ResearchDashboard
    self.viewport.add_widget(ResearchDashboard())
```

---

## 2. API Communications

Always use the singleton `ApiClient` class to query the backend:

```python
from api import ApiClient

api = ApiClient()

# 1. Performing GET requests (automatically uses local SQLite caching fallback if offline)
users_data = api.fetch_get("/users")

# 2. Performing POST requests
payload = {"name": "Physics Lab Grant", "amount": 25000}
res = api.fetch_post("/research/grants", payload)
if res["success"]:
    print("Grant recorded on chain!")
```

---

## 3. WebSockets Integration

To listen to real-time events, register a message callback:

```python
# In your module initialization:
self.api.start_websocket_listener(
    ws_url="ws://localhost:8000/ws/analytics",
    on_message_callback=self.on_ws_message
)

def on_ws_message(self, data):
    # Remember to schedule UI changes on the Kivy Main Thread
    from kivy.clock import Clock
    Clock.schedule_once(lambda dt: self.update_ui(data), 0)
```
