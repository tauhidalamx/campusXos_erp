# C++ Plugin Guide

This guide shows how to build and load dynamic plugins for CampusX.

---

## 1. Plugin Base Interface

Plugins compile as shared libraries (`.dll`, `.dylib`, or `.so`) with a simple C interface:

```cpp
#ifndef PLUGIN_INTERFACE_H
#define PLUGIN_INTERFACE_H

#include <QString>

extern "C" {
    const char* getPluginName();
    void executePluginAction();
}

#endif
```

---

## 2. Dynamic Module Loading

At startup, `CampusXCore` checks the plugins directory and loads available modules:

```cpp
#include "CampusXCore.hpp"
#include <QLibrary>

void CampusXCore::loadPlugins() {
    // Resolve symbols dynamically at runtime
    QLibrary pluginLib("libCampusXPlugin.dylib");
    if (pluginLib.load()) {
        auto getPluginName = (const char* (*)())pluginLib.resolve("getPluginName");
        if (getPluginName) {
            logMessage("INFO", QString("Loaded plugin: %1").arg(getPluginName()));
        }
    }
}
```

This lets you add or update plugins without rebuilding the entire application.

