# -*- coding: utf-8 -*-
"""
CAMPUSX OS Kivy Client - Custom UI Components
Provides styled widgets: cards, inputs, buttons, tables, loaders, and responsive containers.
"""

from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.properties import ListProperty, StringProperty, BooleanProperty, NumericProperty
from kivy.graphics import Color, RoundedRectangle, Line, Rectangle
from kivy.core.window import Window
from ui.theme import theme

class PremiumCard(BoxLayout):
    """Custom card widget with premium drop-shadows, borders, and theme support."""
    border_color = ListProperty([])
    bg_color = ListProperty([])

    def __init__(self, **kwargs):
        super(PremiumCard, self).__init__(**kwargs)
        self.orientation = kwargs.get('orientation', 'vertical')
        self.padding = kwargs.get('padding', 16)
        self.spacing = kwargs.get('spacing', 8)
        
        # Default fallback to theme
        if not self.bg_color:
            self.bg_color = theme.bg_secondary
        if not self.border_color:
            self.border_color = theme.border
            
        theme.register_listener(self.on_theme_changed)
        self.bind(pos=self.update_graphics, size=self.update_graphics, bg_color=self.update_graphics, border_color=self.update_graphics)

    def on_theme_changed(self):
        self.bg_color = theme.bg_secondary
        self.border_color = theme.border
        self.update_graphics()

    def update_graphics(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            # Draw subtle drop shadow (ambient glow)
            Color(0.1, 0.1, 0.1, 0.08)
            RoundedRectangle(pos=(self.pos[0], self.pos[1] - 4), size=(self.size[0], self.size[1]), radius=[14])
            
            # Liquid Card background
            Color(*self.bg_color)
            RoundedRectangle(pos=self.pos, size=self.size, radius=[14])
            
            # Specular top border
            Color(1, 1, 1, 0.4 if theme.active_theme == 'dark' else 0.8)
            Line(rounded_rect=(self.pos[0], self.pos[1], self.size[0], self.size[1], 14), width=1.2)

class CustomButton(Button):
    """Rounded action button with press animations and custom colors."""
    bg_color = ListProperty([])
    text_color = ListProperty([])

    def __init__(self, **kwargs):
        super(CustomButton, self).__init__(**kwargs)
        self.background_color = [0, 0, 0, 0] # transparent base
        self.bold = True
        self.font_size = kwargs.get('font_size', 13)
        
        if not self.bg_color:
            self.bg_color = theme.primary
        if not self.text_color:
            self.text_color = [1, 1, 1, 1]
            
        self.color = self.text_color
        self.bind(pos=self.update_graphics, size=self.update_graphics, bg_color=self.update_graphics)

    def update_graphics(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            # Subtle button shadow
            Color(0, 0, 0, 0.05)
            RoundedRectangle(pos=(self.pos[0], self.pos[1] - 1), size=(self.size[0], self.size[1]), radius=[6])
            
            # Button body
            Color(*self.bg_color)
            RoundedRectangle(pos=self.pos, size=self.size, radius=[6])

    def on_touch_down(self, touch):
        if self.collide_point(*touch.pos):
            # Animate visual press state
            self.bg_color = [c * 0.85 for c in self.bg_color[:3]] + [self.bg_color[3]]
        return super(CustomButton, self).on_touch_down(touch)

    def on_touch_up(self, touch):
        if self.collide_point(*touch.pos):
            # Restore state
            self.bg_color = theme.primary if self.bg_color == theme.primary_hover else self.bg_color
        return super(CustomButton, self).on_touch_up(touch)

class CustomTextInput(TextInput):
    """Custom input text widget matching Light/Dark themes."""
    def __init__(self, **kwargs):
        super(CustomTextInput, self).__init__(**kwargs)
        self.background_normal = ''
        self.background_active = ''
        self.multiline = False
        self.padding = [12, 12, 12, 12]
        self.font_size = 14
        
        theme.register_listener(self.on_theme_changed)
        self.on_theme_changed()
        self.bind(pos=self.update_graphics, size=self.update_graphics)

    def on_theme_changed(self):
        self.background_color = theme.bg_secondary
        self.foreground_color = theme.text_main
        self.cursor_color = theme.primary
        self.hint_text_color = theme.text_subtle
        self.update_graphics()

    def update_graphics(self, *args):
        self.canvas.after.clear()
        with self.canvas.after:
            # Active/inactive border color
            Color(*(theme.primary if self.focus else theme.border))
            Line(rounded_rect=(self.pos[0], self.pos[1], self.size[0], self.size[1], 6), width=1)

class ResponsiveGrid(GridLayout):
    """Grid layout that adjusts columns dynamically based on screen width."""
    def __init__(self, **kwargs):
        super(ResponsiveGrid, self).__init__(**kwargs)
        self.cols = 1
        self.spacing = kwargs.get('spacing', 12)
        self.size_hint_y = None
        self.bind(minimum_height=self.setter('height'))
        Window.bind(on_resize=self.on_window_resize)
        self.on_window_resize(None, Window.width, Window.height)

    def on_window_resize(self, instance, width, height):
        if width > 1000:
            self.cols = 4
        elif width > 700:
            self.cols = 2
        else:
            self.cols = 1

class DataGrid(BoxLayout):
    """Table widget presenting structured row lists with scroll support."""
    def __init__(self, headers: list, **kwargs):
        super(DataGrid, self).__init__(**kwargs)
        self.orientation = 'vertical'
        self.spacing = 4
        
        # Headers line
        self.header_layout = BoxLayout(orientation='horizontal', size_hint_y=None, height=30, padding=[8, 0])
        self.header_layout.bind(pos=self.draw_header_bg, size=self.draw_header_bg)
        
        for h in headers:
            lbl = Label(text=h.upper(), font_size=10, bold=True, color=theme.text_subtle, halign='left')
            lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
            self.header_layout.add_widget(lbl)
            
        self.add_widget(self.header_layout)
        
        # Rows scroll area
        self.scroll = ScrollView()
        self.grid = GridLayout(cols=1, spacing=4, size_hint_y=None)
        self.grid.bind(minimum_height=self.grid.setter('height'))
        self.scroll.add_widget(self.grid)
        self.add_widget(self.scroll)
        
        theme.register_listener(self.on_theme_changed)

    def draw_header_bg(self, instance, value):
        instance.canvas.before.clear()
        with instance.canvas.before:
            Color(*theme.bg_tertiary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(points=[instance.pos[0], instance.pos[1], instance.pos[0] + instance.size[0], instance.pos[1]], width=1)

    def on_theme_changed(self):
        for child in self.header_layout.children:
            child.color = theme.text_subtle
        self.header_layout.canvas.before.clear()
        self.draw_header_bg(self.header_layout, None)

    def clear_rows(self):
        self.grid.clear_widgets()

    def add_row(self, cells: list, on_press_callback=None):
        row = BoxLayout(orientation='horizontal', size_hint_y=None, height=45, padding=[8, 4])
        row.bind(pos=lambda ins, val: self.draw_row_bg(row, ins), size=lambda ins, val: self.draw_row_bg(row, ins))
        
        for c in cells:
            if isinstance(c, str):
                lbl = Label(text=c, font_size=11, color=theme.text_main, halign='left')
                lbl.bind(size=lambda l, s: setattr(l, 'text_size', s))
                row.add_widget(lbl)
            elif isinstance(c, BoxLayout):
                row.add_widget(c)
                
        if on_press_callback:
            # Turn row into a touch button trigger
            row.bind(on_touch_down=lambda ins, touch: self.check_row_touch(row, touch, on_press_callback))
            
        self.grid.add_widget(row)

    def draw_row_bg(self, row, instance):
        row.canvas.before.clear()
        with row.canvas.before:
            Color(*theme.bg_secondary)
            Rectangle(pos=instance.pos, size=instance.size)
            Color(*theme.border)
            Line(points=[instance.pos[0], instance.pos[1], instance.pos[0] + instance.size[0], instance.pos[1]], width=1)

    def check_row_touch(self, row, touch, callback):
        if row.collide_point(*touch.pos):
            callback()

class LoadingSkeleton(BoxLayout):
    """Flickering shimmer widget representing loading data queues."""
    def __init__(self, **kwargs):
        super(LoadingSkeleton, self).__init__(**kwargs)
        self.size_hint_y = None
        self.height = kwargs.get('height', 80)
        self.bind(pos=self.draw_skeleton, size=self.draw_skeleton)
        theme.register_listener(self.draw_skeleton)

    def draw_skeleton(self, *args):
        self.canvas.clear()
        with self.canvas:
            Color(*theme.bg_tertiary)
            RoundedRectangle(pos=self.pos, size=self.size, radius=[8])
            
            # Simple gray visual skeleton elements
            Color(*[c * 1.1 for c in theme.bg_tertiary[:3]] + [1])
            Rectangle(pos=(self.pos[0] + 15, self.pos[1] + self.size[1] - 25), size=(self.size[0] * 0.4, 12))
            Rectangle(pos=(self.pos[0] + 15, self.pos[1] + 20), size=(self.size[0] * 0.8, 10))
