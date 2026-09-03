# 🎓 CampusX OS — Next-Generation University ERP & Autonomous Campus Operating System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/tauhidalamx/campusXos_erp)
[![Framework](https://img.shields.io/badge/Framework-Next.js%2015%20%7C%20React%2019-blue.svg)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Python%20FastAPI-informational.svg)](https://fastapi.tiangolo.com/)
[![Web3](https://img.shields.io/badge/Blockchain-Ethereum%20Solidity%20v0.8.20-gold.svg)](https://soliditylang.org/)
[![Native](https://img.shields.io/badge/Desktop-Qt%20C%2B%2B17%20%7C%20Kivy-purple.svg)](https://qt.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **CampusX OS** is an enterprise-grade, multi-tenant University Enterprise Resource Planning (ERP) platform and Autonomous Campus Operating System. Designed for modern higher education institutions, it combines real-time academic governance, AI-driven sports analytics, 3D Digital Twin IoT building control, Web3 tamper-proof blockchain credentials, and 24/7 Security Operations Center (SOC) cyber threat intelligence.

---

## 📌 Interactive Table of Contents
- [✨ Core Highlights](#-core-highlights)
- [🎬 Live System Walkthrough & Screen Recordings](#-live-system-walkthrough--screen-recordings)
- [🖼 Visual Showcase & Screenshots](#-visual-showcase--screenshots)
- [👥 User Roles & Access Matrix](#-user-roles--access-matrix)
- [🏗 System Architecture & Microservices](#-system-architecture--microservices)
- [🚀 Module Deep-Dive](#-module-deep-dive)
- [⚡ Quick Start & Installation](#-quick-start--installation)
- [🔑 Demo Credentials](#-demo-credentials)
- [🛠 CLI Tools & Scripts](#-cli-tools--scripts)
- [📄 License & Credits](#-license--credits)

---

## ✨ Core Highlights

- 🏢 **Multi-Tenant Global Governance**: Distributed architecture supporting global university clusters with fine-grained RBAC.
- 🎓 **Autonomous Academic Lifecycle**: Automated course registration, timetable optimization, exam seat allocation, and transcript generation.
- 🛡 **Security Operations Center (SOC)**: Live SIEM intrusion detection, global 3D threat map, honeypot telemetry, and AI threat defense matrix.
- ⚽ **Computer Vision & Sports Tactical AI**: Split-screen camera field tracking, sprint velocity vectors, injury risk modeling, and real-time heatmaps.
- 🏛 **3D Digital Twin & IoT Control**: Interactive 3D spatial building blueprint with room occupancy heatmaps, solar grid stats, and HVAC energy meters.
- 💬 **CampusX Connect Collaboration**: Embedded HD video/audio conferencing, real-time channels, interactive code snippet editor, and AI assistant sidecar.
- 🔗 **Web3 Blockchain Credential Vault**: Immutable degree transcripts, fee settlement contracts, and attendance verification stored on Ethereum.
- 💻 **Native C++ & Mobile Apps**: Native Qt/CMake C++ desktop application shell alongside Python/Kivy mobile client with Android Buildozer support.

---

## 🎬 Live System Walkthrough & Screen Recording

### CampusX OS Full System Walkthrough (Screen Rec.)
Full 4-minute 20-second HD live screen recording demonstrating multi-tenant role authentication, master ERP dashboards, faculty directory photo uploads with Cloud DB synchronization, and microservice route navigations.

![CampusX OS Live Screen Recording Walkthrough](docs/videos/Screen_Recording_2026-08-27.gif)

* [▶️ Download / View HD MP4 Video Stream](docs/videos/Screen_Recording_2026-08-27.mp4)

---

## 🖼 Visual Showcase & Screenshots

### 1. Unified Auth & Security Login Gateway
Features clean Figma-grade Sign In and Sign Up tabs, Institutional Role classification, Single Sign-On (SSO), and live Firebase / Cloud Database auto-synchronization.
![Unified Auth & Security Gateway](docs/screenshots/login_page.png)

---

### 1. Executive Master ERP Dashboard
The central command hub for university leadership providing real-time metrics, financial health, enrollment trends, and institutional KPIs.
![Executive Master Dashboard](docs/screenshots/hero_dashboard.png)

---

### 2. Global Super Admin Multi-Tenant Console
Monitors global campus clusters across Boston, London, Tokyo, Sydney, and Singapore with microservice latencies, CPU/RAM server loads, and live audit logs.
![Super Admin Console](docs/screenshots/super_admin_console.png)

---

### 3. Student Portal & Academic Hub
A personalized interface for students featuring live GPA dials, circular attendance rings, interactive class timetables, upcoming exam countdowns, and fee clearance badges.
![Student Portal](docs/screenshots/student_portal.png)

---

### 4. Cybersecurity Operations Center (SOC) Architecture
24/7 SIEM monitoring console featuring a 3D global threat map, live intrusion detection event stream, AI threat defense matrix, and firewall policy status.

```mermaid
graph TD
    subgraph Data Ingestion & Sensors
        A[Gateway Telemetry] --> B[SIEM Log Ingestion Engine]
        C[Honeypot Decoys] --> B
        D[Firewall Audit Logs] --> B
    end

    subgraph AI Threat Processing Matrix
        B --> E[TensorFlow.js Anomaly Classifier]
        E --> F{Threat Level Assessment}
        F -->|High / CRITICAL| G[Auto Isolation & IP Ban]
        F -->|Medium / LOW| H[SIEM Audit Trail Event]
    end

    subgraph SOC Dashboard & Defense Actions
        G --> I[3D Global Threat Map UI]
        H --> I
        I --> J[SOC Operator Console & Incident Response]
    end
```

---

### 5. Computer Vision & Tactical Sports AI Architecture
Empowers coaches and sports directors with player bounding-box video tracking, sprint velocity vectors, fatigue prediction, tactical heatmaps, and substitution AI.

```mermaid
graph LR
    subgraph Camera Feeds & Video Processing
        Cam1[Field Camera Feed 1] --> CV[OpenCV / YOLOV8 Object Detector]
        Cam2[Court Camera Feed 2] --> CV
    end

    subgraph AI Tactical Analytics Pipeline
        CV --> Box[Player Bounding-Box Tracking]
        Box --> Speed[Sprint Velocity & Acceleration Vectors]
        Box --> Map[Positional Pitch Heatmaps]
        Speed --> Fatigue[TensorFlow Fatigue & Strain Prediction]
    end

    subgraph Coach & Tactical Decision Support
        Fatigue --> CoachUI[Sports OS Coach Dashboard]
        Map --> CoachUI
        CoachUI --> Sub[AI Substitution & Injury Risk Alert]
    end
```

---

### 6. Digital Twin 3D Building & IoT Control Architecture
Spatial 3D university blueprint tracking live HVAC energy consumption, solar panel power output, smart door access logs, and environmental air quality sensors.

```mermaid
graph TD
    subgraph Campus IoT Sensors & Hardware
        S1[Smart Door Access Locks] --> Hub[IoT MQTT & CoAP Broker]
        S2[HVAC & Energy Flow Meters] --> Hub
        S3[Rooftop Solar Array Sensors] --> Hub
        S4[Indoor Air Quality CO2/PM2.5 Sensors] --> Hub
    end

    subgraph Edge & Spatial Twin Processing
        Hub --> Engine[Spatial 3D Twin Sync Engine]
        Engine --> Physics[Energy Consumption & Air Quality Analytics]
    end

    subgraph Digital Twin Control Interface
        Physics --> Blueprint[3D Interactive Building Blueprint UI]
        Blueprint --> Controls[Smart Building Controls & Auto HVAC Tuning]
    end
```

---

### 7. CampusX Connect Collaboration Hub Architecture
Real-time communication suite integrating HD video meetings, class discussion channels, live collaborative code editor, and CampusX AI sidecar assistance.

```mermaid
graph TD
    subgraph Real-Time Communication Layer
        U1[Student Browser] <--> WebRTC[WebRTC Mesh HD Video / Audio]
        U2[Faculty Browser] <--> WebRTC
        U1 <--> WS[WebSocket Signaling Server]
        U2 <--> WS
    end

    subgraph Collaboration & AI Sidecar
        WS --> Room[Course Channels & DM Messaging]
        WS --> Code[Live Collaborative Code Editor]
        WS --> AI[CampusX AI Sidecar Assistant]
    end

    subgraph Data & Storage Backplane
        Room --> DB[(SQLite / MongoDB Chat Store)]
        Code --> DB
        AI --> RAG[CampusX RAG Knowledge Base]
    end
```

---

### 8. Web3 Blockchain Credential Vault Architecture
Verifies academic transcripts and student credentials against Ethereum smart contracts (`CredentialVault.sol`, `AttendanceSystem.sol`) with cryptographic hash validation.

```mermaid
graph LR
    subgraph Student / University IAM
        Uni[University Registrar] --> Issuer[EIP-712 Degree Signature Engine]
        Stu[Student DID Wallet] --> Issuer
    end

    subgraph Ethereum Blockchain Smart Contracts
        Issuer --> Vault[CredentialVault.sol Smart Contract]
        Issuer --> Att[AttendanceSystem.sol Smart Contract]
        Vault --> Eth[(Ethereum Ledger / Sepolia Testnet)]
        Att --> Eth
    end

    subgraph Public Verification Engine
        Eth --> Verifier[Cryptographic Hash Verifier]
        Employer[Third-Party Recruiter / Employer] --> Verifier
        Verifier --> Result[Instant Authenticity & Hash Match Result]
    end
```

---

## 👥 User Roles & Access Matrix

CampusX OS enforces strict Role-Based Access Control (RBAC) across 18 distinct user personas to ensure data isolation, regulatory compliance, and customized user workflows.

### Role Overview Table

| Role Identifier | User Persona | Primary Responsibilities | Target Landing Page |
| :--- | :--- | :--- | :--- |
| `superadmin` | **Global Super Admin** | Multi-tenant university cluster management, cloud infrastructure, global SOC | [`/admin/global`](file:///Users/tauhidalam/antygravity/app/admin/global/page.js) |
| `platformadmin` | **Platform Administrator** | Microservice health, node topology, database shard maintenance & API gateways | [`/admin/platform`](file:///Users/tauhidalam/antygravity/app/admin/platform/page.js) |
| `admin` | **University Admin** | Executive ERP dashboard, institutional metrics, budget overview & NAAC/NIRF reporting | [`/erp/admin`](file:///Users/tauhidalam/antygravity/app/erp/admin/page.js) |
| `registrar` | **Registrar Officer** | Enrolment verification, academic transcripts, degree verification & regulatory filings | [`/erp/registrar`](file:///Users/tauhidalam/antygravity/app/erp/registrar/page.js) |
| `dean` | **Dean of Faculty** | Academic governance, curriculum approvals, faculty workload & research grants | [`/erp/dean`](file:///Users/tauhidalam/antygravity/app/erp/dean/page.js) |
| `hod` | **Head of Department (HOD)** | Department schedule, course allocation, marks approvals & lab management | [`/erp/hod`](file:///Users/tauhidalam/antygravity/app/erp/hod/page.js) |
| `faculty` | **Faculty / Professor** | Class scheduling, attendance marking, assignment grading & student mentoring | [`/faculty/home`](file:///Users/tauhidalam/antygravity/app/faculty/home/page.js) |
| `student` | **Student** | Course registration, grade cards, attendance tracker, fee payment & library access | [`/student/home`](file:///Users/tauhidalam/antygravity/app/student/home/page.js) |
| `parent` / `sports_parent` | **Parent** | Student academic monitoring, fee dues payment, attendance alerts & health updates | [`/parent/dashboard`](file:///Users/tauhidalam/antygravity/app/parent/dashboard/page.js) |
| `alumni` | **Alumni** | Networking portal, donation management, transcript requests & career mentoring | [`/alumni/home`](file:///Users/tauhidalam/antygravity/app/alumni/home/page.js) |
| `recruiter` | **Lead Recruiter** | Corporate placement portal, candidate shortlisting, interview scheduling & offer releases | [`/recruiter/dashboard`](file:///Users/tauhidalam/antygravity/app/recruiter/dashboard/page.js) |
| `placement_officer` | **Placement Officer** | Drive coordination, company liaison, salary statistics & mock interview tracking | [`/placement/dashboard`](file:///Users/tauhidalam/antygravity/app/placement/dashboard/page.js) |
| `research_coordinator` | **Research Coordinator** | Grant tracking, patent filings, journal publication indices & lab stock portfolios | [`/research/dashboard`](file:///Users/tauhidalam/antygravity/app/research/dashboard/page.js) |
| `finance_manager` | **Finance Manager** | Institutional accounting, tuition fee ledgers, payroll processing & audit logs | [`/finance/dashboard`](file:///Users/tauhidalam/antygravity/app/finance/dashboard/page.js) |
| `sports_director` | **Sports Director** | Athletics management, tournament planning, team selections & tactical AI analytics | [`/sports/director`](file:///Users/tauhidalam/antygravity/app/sports/[[...slug]]/page.js) |
| `coach` | **Athletic Coach** | Player performance metrics, training drills, injury logs & video biomechanics | [`/sports/coach`](file:///Users/tauhidalam/antygravity/app/sports/[[...slug]]/page.js) |
| `athlete` | **Student Athlete** | Personal fitness metrics, event schedules, performance analytics & tactical AI breakdown | [`/sports/athlete`](file:///Users/tauhidalam/antygravity/app/sports/[[...slug]]/page.js) |
| `soc` / `compliance` | **Security Officer** | Real-time threat detection, SIEM log analysis, firewall policy tuning & compliance | [`/soc`](file:///Users/tauhidalam/antygravity/app/soc/page.js) |

---

## 🏗 System Architecture & Microservices

CampusX OS employs a decoupled hybrid microservice and multi-client architecture:

```mermaid
graph TD
    A["Client Layer"] --> B["Next.js 15 Web Platform (/app)"]
    A --> C["Qt C++ Native Desktop (/campusx_native_cpp)"]
    A --> D["Python/Kivy Mobile App (/campusx_desktop_mobile)"]

    B & C & D --> E["API Gateway & Auth Middleware"]

    E --> F["Node.js / Express Services (/backend)"]
    E --> G["Python FastAPI Services (/campusx_backend_python)"]
    E --> H["Sports Vision Pipeline (/backend_sports)"]

    F --> I[("Prisma / SQLite / MongoDB")]
    F --> J["Apache Kafka Event Bus"]

    G & H --> K[("Analytics & Cache DB")]

    F --> L["Web3 Ethereum Contracts (/contracts/modular)"]
```

### Stack Components
- **Web App**: Next.js 15, React 19, Framer Motion, Vanilla CSS Design System, Lucide Icons.
- **Node.js Backend**: Express.js 5, TypeScript, KafkaJS, Mongoose, SQLite3, Prisma.
- **Python Backend**: FastAPI, Celery, OpenCV, PyTorch, PySparks, TensorFlow.
- **Blockchain**: Solidity v0.8.20, Hardhat, Ethers.js.
- **Native Desktop**: C++17, Qt 6, CMake Build Automation.
- **Mobile Client**: Python 3.9, Kivy 2.3, Buildozer Android Bootstrap.

---

## 🚀 Module Deep-Dive

### 1. Smart Academic & Examination Engine
- **Exam Seat Allocation**: Automated room and bench placement algorithm avoiding adjacent same-subject seating.
- **Faculty Course Allocation**: Algorithmic course assignment based on faculty domain expertise, workload limits, and student ratings.
- **Mark Approval Workflow**: Multi-tier approvals (Faculty → HOD → Dean → Registrar) before grade card generation.

### 2. Web3 Blockchain Credentialing (`/contracts/modular`)
- **`CredentialVault.sol`**: Issues tamper-proof digital degree certificates on EVM chains.
- **`AttendanceSystem.sol`**: Immutable attendance verification logged per class period.
- **`AcademicCreditContract.sol`**: Decentralized course credit bank enabling inter-university credit transfers.

### 3. Cyber Threat Intelligence & SOC (`/app/soc`)
- **Global SIEM Stream**: Real-time IP geolocation, threat severity classification, and attack vector visualization.
- **Honeypot Network**: Traps unauthorized SSH/HTTP intrusion attempts and records adversary TTPs.
- **AI Defense Matrix**: Automated IP blacklisting, rate-limiting, and anomaly detection.

### 4. 3D Digital Twin & IoT Control (`/app/twin`)
- **Building Spatial Mesh**: Interactive WebGL 3D rendering of campus floors and rooms.
- **Energy Optimization**: Solar power generation tracking vs. HVAC and lab power draw.
- **Environmental Sensing**: Room CO2 levels, temperature, PM2.5 air quality, and noise meters.

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Python**: `v3.10` or higher
- **C++ Compiler**: Clang / GCC with CMake (`v3.20+`) (Optional for Native C++ desktop build)
- **Git**: Installed and configured

### 1. Repository Setup
```bash
git clone https://github.com/tauhidalamx/campusXos_erp.git
cd campusXos_erp
npm install
```

### 2. Launch Development Servers
Launch the full Next.js ERP web application along with dev environment APIs using the unified `./campusx` CLI tool:
```bash
# Using the unified campusx CLI wrapper
./campusx dev

# Or using standard npm scripts
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build Production Ecosystem
To compile the web frontend, backend bundles, C++ desktop engine, and verify full build integrity:
```bash
./campusx build
```

---

## 🔑 Demo Credentials & Authentication

CampusX OS provides static and Firebase-integrated client authentication with seamless role inference. Navigate to [`http://localhost:3000/login`](http://localhost:3000/login) to sign in or register a new account.

### Standard Demo Accounts

Use any of the institutional persona accounts below:

| Institutional Role | Email Address | Password | Landing Dashboard |
| :--- | :--- | :--- | :--- |
| 🎓 **Student Role** | `student@campusx.edu` | `student123` | `/student/home` |
| 👨‍🏫 **Faculty Member** | `faculty@campusx.demo` | `Demo@123` | `/faculty/home` |
| 🏢 **Head of Department (HOD)** | `hod@campusx.demo` | `Demo@123` | `/erp/hod` |
| 📜 **Dean of Faculty** | `dean@campusx.demo` | `Demo@123` | `/erp/dean` |
| 📑 **Registrar Officer** | `registrar@campusx.demo` | `Demo@123` | `/erp/registrar` |
| 🛡 **University Administrator** | `univadmin@campusx.demo` | `Demo@123` | `/erp/admin` |
| 🌐 **Global Super Admin** | `superadmin@campusx.demo` | `Demo@123` | `/admin/global` |
| 💻 **Platform Admin** | `admin@campusx.demo` | `Demo@123` | `/admin/platform` |
| 💰 **Finance Manager** | `finance@campusx.demo` | `Demo@123` | `/finance/dashboard` |
| 💼 **Placement Officer** | `placement@campusx.demo` | `Demo@123` | `/placement/dashboard` |
| 🏢 **Corporate Recruiter** | `recruiter@campusx.demo` | `Demo@123` | `/recruiter/dashboard` |
| 🏅 **Sports Director** | `sportsdirector@campusx.demo` | `Demo@123` | `/sports/director` |
| 🏃 **Athletic Coach** | `coach@campusx.demo` | `Demo@123` | `/sports/coach` |
| 🥇 **Student Athlete** | `athlete@campusx.demo` | `Demo@123` | `/sports/athlete` |
| 👨‍👩‍👦 **Parent Account** | `parent@campusx.demo` | `Demo@123` | `/parent/dashboard` |

---

### Custom Sign Up & Single Sign-On (SSO)

- **Create Account (Sign Up)**: Switch to the **Sign Up** tab, fill in your name, email, and choose your **Institutional Role** (defaults to `Student Role`). Your account is instantly registered and saved locally in `localStorage` and synchronized with Firebase Cloud Firestore if configured.
- **Single Sign-On**: One-click sign-in via **Google** or **Microsoft** SSO.

---

## 🛠 CLI Tools & Scripts

CampusX OS includes a command-line runner [`./campusx`](file:///Users/tauhidalam/antygravity/campusx) for convenient ecosystem management:

```bash
# Start Next.js development server
./campusx dev

# Run full project build (Frontend, Microservices, C++ Native)
./campusx build

# Execute automated test suites
./campusx test

# Start production server
./campusx run
```

---

## 📄 License & Credits

Designed and developed with ❤️ for next-generation higher education systems.

- **License**: [MIT License](LICENSE)
- **Repository**: [github.com/tauhidalamx/campusXos_erp](https://github.com/tauhidalamx/campusXos_erp)
