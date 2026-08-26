# CAMPUSX OS — Production-Grade Master Update Blueprint (2026 Edition)

This blueprint documents the production-grade architectural specifications, database models, event pipelines, machine learning structures, and deployment topologies required to transform CAMPUSX OS into a decentralized, AI-native University Operating System at scale.

---

## 1. Updated Database Schema (PostgreSQL DDL)

We use PostgreSQL as the primary relational system. Tenant isolation is enforced at the database layer using Row-Level Security (RLS) policies.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TENANT DEFINITION
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'standard',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- USER IDENTITY (MFA & SSO SUPPORTED)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'student', 'faculty', 'hod', 'admin', 'alumni'
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_users ON users 
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- STUDENT MASTER PROFILES
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id_card VARCHAR(50) NOT NULL,
    gpa NUMERIC(3,2) DEFAULT 0.00,
    semester INT NOT NULL DEFAULT 1,
    attendance_rate NUMERIC(5,2) DEFAULT 0.00,
    academic_status VARCHAR(50) NOT NULL DEFAULT 'good_standing',
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, student_id_card)
);
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_students ON student_profiles 
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- RESEARCH PROVENANCE LEDGER
CREATE TABLE IF NOT EXISTS research_publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    lead_author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ipfs_metadata_cid VARCHAR(100) NOT NULL,
    blockchain_tx_hash VARCHAR(66) UNIQUE,
    citations_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE research_publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_research ON research_publications 
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- CAMPUS SOCIAL POSTS (CAMPUSX CONNECT)
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'campus', -- 'research', 'placement', 'club'
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_posts ON social_posts 
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- CORE AUDIT LOG SYSTEM
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON SET NULL,
    action_type VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_audit ON audit_logs 
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## 2. Realistic Seed Data Architecture

To simulate a university dataset with **10,000+ Students, 1,000+ Faculty, 200+ Courses, 5,000+ Research Papers, and 50,000+ Attendance Logs**, we implement a batch seeding strategy.

### Data Sizing Matrix:
*   **Students**: 10,000 records. Split across Computer Science (40%), Electronics (30%), Business (20%), Biotech (10%).
*   **Faculty**: 1,000 records. Assigned to 50 departments.
*   **Attendance Logs**: 50,000 entries tracking presence ratios over a 60-day historical window.
*   **Social Interactions**: 5,000 community posts and 10,000 comments.

### Seeding Pipeline (Node.js Batch Script Mock):
```javascript
// scripts/seed-generator.js
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function seedUniversityDataset() {
  await client.connect();
  console.log("Starting batch seeding process...");
  
  // Seed Departments & Courses
  for (let d = 1; d <= 50; d++) {
    await client.query(`INSERT INTO departments(id, name) VALUES ('DEP${d}', 'Department of Science ${d}') ON CONFLICT DO NOTHING`);
  }
  
  // Batch insertion of Students
  const batchSize = 1000;
  for (let i = 0; i < 10000; i += batchSize) {
    let values = [];
    for (let j = 0; j < batchSize; j++) {
      const idx = i + j;
      values.push(`('stu_${idx}', 'Student ${idx}', 'student_${idx}@campusx.edu', 'DEP${(idx % 50) + 1}')`);
    }
    await client.query(`INSERT INTO students(id, name, email, dept_id) VALUES ${values.join(',')}`);
    console.log(`Seeded students: ${i + batchSize}/10000`);
  }
  
  await client.end();
  console.log("Seeding complete!");
}
```

---

## 3. Complete API Design (gRPC & REST Specs)

### gRPC Contract (`collaboration_hub.proto`):
```protobuf
syntax = "proto3";

package campusx.collaboration;

service CollaborationHub {
  rpc SendDirectMessage (MessageRequest) returns (MessageResponse);
  rpc StreamGroupChannel (ChannelSubscription) returns (stream MessagePayload);
  rpc CreateCommunityPost (PostRequest) returns (PostResponse);
}

message MessageRequest {
  string sender_id = 1;
  string recipient_id = 2;
  string message_body = 3;
}

message MessageResponse {
  string message_id = 1;
  int64 timestamp = 2;
  bool delivered = 3;
}

message ChannelSubscription {
  string channel_id = 1;
  string user_id = 2;
}

message MessagePayload {
  string sender_id = 1;
  string message_body = 2;
  int64 timestamp = 3;
}

message PostRequest {
  string author_id = 1;
  string content = 2;
  string category = 3; // research, social, job
}

message PostResponse {
  string post_id = 1;
  bool success = 2;
}
```

### Public REST Mappings:
*   `POST /api/social/post`: Creates social posts (Connect module).
*   `GET /api/recruitment/jobs`: Lists job placement listings.
*   `POST /api/recruitment/apply`: Applies for internship openings.

---

## 4. Frontend Component Architecture (Next.js 16)

```text
apps/web-portal/
├── app/
│   ├── layout.tsx              # Sidebar AppLayout shell with notifications Drawer
│   ├── page.tsx                # Enterprise ERP KPI Dashboard
│   ├── connect/                # LinkedIn+Discord layout (Feed / Groups / Threads)
│   ├── blockchain/             # 14-tab CAMPUSX CHAIN verification terminal
│   ├── stock/                  # Quant Stock terminal & TensorFlow fitting workspace
│   ├── ai-assistant/           # Central RAG knowledge base drawer
│   └── globals.css             # Main styling overrides
├── components/
│   ├── social-feed/            # PostCard, CommentSection, StoriesViewer
│   ├── quant-chart/            # Canvas Candlestick chart overlaid with indicators
│   └── ui/                     # Shadcn primitives
└── store/
    ├── auth-store.ts           # Zustand user credentials state
    └── network-store.ts        # Zustand live block transaction state
```

---

## 5. Backend Microservices Layout

CAMPUSX OS divides responsibilities into isolated services organized under **Hexagonal (Ports & Adapters)** structures.

```
       [ Client Request / Event Ingest ]
                       │
                       ▼ (Primary Ports)
        ┌───────────────────────────────┐
        │       API Gateway Controller  │
        └──────────────┬────────────────┘
                       │
                       ▼
        ┌───────────────────────────────┐
        │        Application Services   │ (Hexagon Core)
        │   - StudentRegistryService    │
        │   - IdentityVerification      │
        └──────────────┬────────────────┘
                       │
                       ▼ (Secondary Ports)
        ┌───────────────────────────────┐
        │   Database / Kafka Adapters   │
        └───────────────────────────────┘
```

### Microservices Definitions:
1.  **Identity Service**: Handles asymmetric token signatures and zero-trust auth.
2.  **Academics Registry**: Manages students, faculty, and grading.
3.  **Financial Ledger**: Handles fee payments and escrow disbursements.
4.  **AI System Broker**: Interfaces with LLMs and Qdrant database.

---

## 6. Kafka Event Architecture

Services stream operations asynchronously to maintain eventual consistency.

```text
 [ Academic Service ]  ──> ( student.graduated ) ──> [ Kafka Topic ]
                                                           │
                                                           ├──> [ Wallet SBT Issuer ]
                                                           └──> [ Social Announcement ]
```

### Topics Specification:
1.  `campusx.academics.enrollment`: Emits new enrollment vectors.
2.  `campusx.blockchain.mint`: Triggers Soulbound Token generation on Polygon/Fabric.
3.  `campusx.social.activity`: Emits likes, comments, and mentions.

### DLQ Configuration:
*   **Retry Topic**: `campusx.academics.enrollment.retry` (5-minute backoff TTL).
*   **Dead Letter Queue**: `campusx.academics.enrollment.dlq` (operator analysis endpoint).

---

## 7. TensorFlow Architecture

Deep learning models predict student performance and risk profiles.

```
Input Vector [GPA, Attendance, Assignment Score, Library Logs]
   │
   ├──► Dense Layer [64 Units, Relu]
   ├──► Dropout Layer [0.2]
   ├──► Dense Layer [32 Units, Relu]
   └──► Dense Output Layer [1 Unit, Sigmoid (Dropout Likelihood)]
```

### Resource Quotas in Kubernetes:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: ml-gpu-quota
  namespace: campusx-ml
spec:
  hard:
    requests.nvidia.com/gpu: "4"
    limits.nvidia.com/gpu: "8"
    requests.memory: 32Gi
    limits.memory: 64Gi
```

---

## 8. Kubeflow Pipelines

```python
from kfp import dsl

@dsl.component
def ingest_logs(tenant_id: str) -> str:
    # Pulls library, class attendance logs from MinIO storage
    return "/tmp/raw_data.csv"

@dsl.component
def train_risk_classifier(data_path: str) -> str:
    import tensorflow as tf
    # Normalizes factors, trains deep classifier model
    return "/tmp/saved_model"

@dsl.component
def validate_deployment(model_path: str, threshold: float) -> bool:
    # Assesses classification accuracy against validation subset
    return True

@dsl.pipeline(name="student-dropout-predictor")
def student_risk_pipeline():
    logs = ingest_logs(tenant_id="campusx-main")
    model = train_risk_classifier(data_path=logs.output)
    validate_deployment(model_path=model.output, threshold=0.92)
```

---

## 9. Blockchain Architecture (CAMPUSX CHAIN)

CAMPUSX CHAIN uses a **Consortium Hybrid Blockchain Model**:

```
        Public Polygon Anchors (State proof roots, verified DIDs)
                       ▲
                       │ (Chainlink Oracle Bridge)
                       │
       Private Consortium Ledger Channels (Hyperledger Fabric)
 (Student Grades, Course Transcripts, Research IP collaboration logs)
```

*   **Public Anchor Layer**: Polygon PoS anchors cryptographical state proofs of the private ledger every hour.
*   **Private Channel Layer**: Multi-campus peer nodes run Raft consensus to synchronize ledger data, maintaining compliance with privacy frameworks.

---

## 10. Market Intelligence Architecture

The financial research desk implements predictive LSTM models to analyze student portfolios and research funding yields.

```
Inputs: [Historical indices, Sentiment score, Volatility metrics]
   │
   ├──► LSTM Layer [64 Units]
   └──► Dense Layer [1 Output Unit (Yield Forecast)]
```

### Risk Analytics Calculations:
*   **Sharpe Ratio**: $SR = (R_p - R_f) / \sigma_p$
*   **Sortino Ratio**: $Sortino = (R_p - R_f) / \sigma_d$ (where $\sigma_d$ is downside deviation).
*   **Value-at-Risk (VaR)**: Parametric calculation at 95% confidence over a 5-day window.

---

## 11. Research Platform Architecture

Logs research creation, citations, and patents to Arweave and IPFS.

```
  Research Paper PDF Upload -> Pinned on Arweave (Permanent CID)
                                     │
                                     ▼
                Anchor Citation Hash on ResearchProvenance Contract
                                     │
                                     ▼
                      Update Peer Review Index
```

*   **Arweave Permanent Storage**: Stores PDF copies and research raw datasets.
*   **On-chain References**: Graph paths are stored inside `ResearchProvenance.sol` contracts mapping parent hashes to target citations.

---

## 12. Chat Architecture

Supports real-time student-faculty communication over a distributed node cluster.

```
   Client A ──► Socket.IO Pod 1 ──► Redis Pub/Sub ──► Socket.IO Pod 2 ──► Client B
                     │
                     ▼
       Stage buffer in MongoDB (Write-Behind batch save every 5s)
```

*   **Redis Pub/Sub broker**: Synchronizes communication channels across different WebSocket pods.
*   **Write-Behind cache**: Messages are buffered in memory and batched to the persistent database every 5 seconds to reduce write-lock occurrences.

---

## 13. AI Assistant Architecture & RAG

Coordinates AI agents using localized LLMs and vector database retrieval.

```
  User Query ──► AI Agent Coordinator ──► Vector Lookup (Qdrant)
                                               │
                                               ▼ (Provide Context)
                                    DeepSeek-R1 (Local Pod)
                                               │
                                               ▼
                                      Generated Response
```

*   **Vector DB (Qdrant)**: Stores embeddings of research notes, policy sheets, and course catalogs.
*   **Routing Agent**: Directs queries to DeepSeek-R1 or Llama based on prompt complexity.

---

## 14. Notification Architecture

Coordinates notifications across multiple communication channels (Email, SMS, Push).

```
 ERP System Event ──► BullMQ Priority Queue (Redis) ──► Worker Workers
                                                             │
                                   ┌─────────────────────────┼─────────────────────────┐
                                   ▼                         ▼                         ▼
                              APNS Pods                 SMTP Pods                Twilio Gateway
```

*   **Priority Scheduler**: Classifies notifications (e.g., immediate grade publications vs. weekly newsletters).
*   **BullMQ Execution**: Handles retry bounds, message tracking, and delivery diagnostics.

---

## 15. Analytics Architecture

Relies on InfluxDB and OpenSearch to compile analytics.

```
  IoT / App Logs ──► Vector Agent ──► Kafka Stream ──► InfluxDB (TS Data)
                                                           │
                                                           ▼
                                                   Grafana Dashboard
```

*   **InfluxDB Timeseries DB**: Captures live telemetry, attendance check-ins, and gas metrics.
*   **Grafana Dashboard**: Visualizes resource limits, server health, and blockchain transactions.

---

## 16. Kubernetes Deployment Topology

CAMPUSX OS is deployed across automated Kubernetes worker nodes.

```yaml
# k8s/production-topology.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: campusx-core-service
  namespace: campusx-prod
spec:
  replicas: 5
  strategy:
    rollingUpdate:
      maxSurfeit: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: campusx-core-service
  template:
    metadata:
      labels:
        app: campusx-core-service
    spec:
      containers:
        - name: core
          image: campusx-registry.edu/core-service:v2.1.0
          resources:
            requests:
              cpu: "1000m"
              memory: "2Gi"
            limits:
              cpu: "2000m"
              memory: "4Gi"
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
            initialDelaySeconds: 15
```

---

## 17. Security Architecture

1.  **Asymmetric Cryptography**: API requests require JWT authentication validated with RS256 public keys retrieved from a secure Key Management Service.
2.  **Fine-Grained Authorization (Casbin)**: Implements Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) to enforce boundaries (e.g., students cannot modify grades).
3.  **Encrypted Transport**: Enforces TLS 1.3 across all client-to-gateway connections and mutual TLS (mTLS) inside the cluster mesh.

---

## 18. CI/CD GitOps Pipeline

```
 [ Commit / Main ] ──► Unit / Lint Audits ──► Trivy Image Audit ──► ArgoCD Sync
```

1.  **Code Scans**: GitHub Actions runs automated unit testing and lint validations.
2.  **Security Scans**: Trivy scans container images for CVE vulnerabilities.
3.  **GitOps Sync**: ArgoCD detects configuration changes in git and rolls out updates to EKS/GKE clusters.

---

## 19. Monitoring & Telemetry Architecture

*   **Trace Collections**: OpenTelemetry gathers traces across all microservices.
*   **Metrics Scraping**: Prometheus pulls pod and node data, sending alerts to Alertmanager for Slack/PagerDuty routing.
*   **Log Centralization**: FluentBit collects stdout streams and indexes them in OpenSearch.

---

## 20. Production Readiness Checklist

*   [ ] Verify database connection pooling handles 20,000+ open sessions.
*   [ ] Configure active-active cross-region database replication.
*   [ ] Run stress test script to confirm API gateway handles 10,000 requests/sec.
*   [ ] Configure automatic backup schedules to cold-storage S3 buckets.
*   [ ] Validate CORS and rate limiting rules on Envoy gateways.
*   [ ] Confirm TLS certificates are managed by automatic renewal providers (Let's Encrypt).
