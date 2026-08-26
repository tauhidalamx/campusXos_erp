# CAMPUSX OS C++ - UI Component Guide

This guide details the reusable Qt 6 GUI components defined in the `ui/` package.

---

## 1. Application Layout Window

The main window inherits from `QMainWindow` and provides a split layout:
- **Left Rail Sidebar (`QFrame#sidebar`)**: Navigation drawer containing page buttons.
- **Center Canvas**: Main viewport loading modular workspaces.
- **Right Drawers (`QFrame#aiPanel`)**: Collapsible panel for LLM advisory chats.

---

## 2. Shared Layout Components

### Custom Card Widgets (`QFrame#card`)
- Rounded border frame styled dynamically using colors resolved by the `ThemeEngine`.
- Used to wrap roster stats, token verifiers, and trading portfolios.

### Interactive Data Grid (`QTableWidget`)
- Multi-column table supporting sorting, alternate row colors, and scroll Virtualization.
- Automatically adjusts margins to match dense layout options.

---

## 3. Command Palette / Settings
- **`SettingsPanel`**: Embedded tab containing slider controls for system typography, selection boxes for active theme palettes, and flags for screen motions.
- Adjustments apply instantly to the global `qApp` styles stack.
