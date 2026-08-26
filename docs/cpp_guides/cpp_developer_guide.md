# C++ Developer Guide

This guide explains how to add new modules and make API calls in the C++ desktop client.

---

## 1. Creating a New UI Module

To add a new view module (for example, `ResearchModule`):

1. Create a class file at `ui/modules/ResearchModule.hpp`:
```cpp
#ifndef RESEARCHMODULE_HPP
#define RESEARCHMODULE_HPP

#include <QWidget>

class ResearchModule : public QWidget {
    Q_OBJECT
public:
    explicit ResearchModule(QWidget* parent = nullptr);
    ~ResearchModule() = default;
};

#endif
```

2. Add your layout implementation in `ResearchModule.cpp`.
3. Add the files to `SOURCES` and `HEADERS` in `CMakeLists.txt`.
4. Register your module tab inside `ui/DashboardWindow.cpp`.

---

## 2. Making API Calls

Use `ApiClient` to send asynchronous HTTP requests:

```cpp
#include "ApiClient.hpp"

QJsonObject payload;
payload["name"] = "CS Lab";

ApiClient::instance().fetchPost("/users", payload, [](bool success, const QJsonObject& res) {
    if (success) {
        std::cout << "User added successfully!" << std::endl;
    }
});
```

