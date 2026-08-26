# CampusX OS - Universal Master Build System

This document outlines the unified developer experience and packaging pipeline for **CampusX OS**. By utilizing the `campusx` master command, developers can manage, validate, compile, and deploy the entire multi-stack ecosystem (Next.js, FastAPI, Qt, Kivy, Solidity, and Docker) from a single consistent interface.

---

## 1. Commands Quick Reference

| Command | Action / Target Description |
| :--- | :--- |
| `campusx setup` | Provision local virtualenv, download pip/npm packages, compile contracts |
| `campusx dev` | Launch Next.js dashboard, FastAPI backends, and local Kivy reloader |
| `campusx build` | Build Next.js bundle, run CMake Qt compiler, pyinstaller and smart contracts |
| `campusx run` | Boot production frontends and gateway backends |
| `campusx test` | Execute FastAPIs tests, blockchain assertions, and sports neural checks |
| `campusx package` | Compile standalone distributions (`.dmg`, `.app`, `.apk`, `.sha256`) |
| `campusx release` | Git tagging, version release indexing, and artifact zips |
| `campusx clean` | Purge compiled targets, cache objects, and prune Docker containers |
| `campusx rebuild` | clean -> setup -> build -> test -> package |
| `campusx doctor` | Integrity diagnostics checking ports, dependencies, database files, and SDKs |
| `campusx deploy` | Package docker images and release helm upgrade setups to Kubernetes |

---

## 2. Multi-Technology Auto-Detection

The build engine automatically scans the active workspace root for corresponding module structures:
- **Next.js / TypeScript**: Triggers static builds when `next.config.js` is online.
- **FastAPI / Python**: Boots FastAPI app router when `campusx_backend_python/main.py` is present.
- **C++ Qt / CMake**: Automatically runs CMake builds on `campusx_native_cpp/` directory.
- **Kivy Desktop**: Spawns GUI and packages executables when Kivy libraries are found.
- **Solidity / Hardhat**: Builds and deploys Ethereum smart contracts if `hardhat.config.js` is active.

---

## 3. Local Development Flow

To start developing in the ecosystem, run:
```bash
campusx setup
campusx dev
```
The CLI automatically:
1. Clears existing port binds (3000, 8000, 8081).
2. Deploys local broker services (Redis, Kafka) if Docker is running.
3. Spawns Next.js frontend on `http://localhost:3000`.
4. Spawns FastAPI backend on `http://localhost:8000`.
5. Boots the Kivy cross-platform GUI client window.

---

## 4. Diagnostics & Troubleshooting (`campusx doctor`)

If you encounter startup issues, execute:
```bash
campusx doctor
```
The doctor diagnostics utility runs live verification loops over node, npm, python3, cmake, ninja, docker, local port conflicts, and SQLite databases schema sizes to suggest corrective remedies.
