# PRVIO Earth — Architecture Diagram Set

**Version:** v1.0.0
**Last updated:** 2026-06-19
**Author:** PRVIO Earth Architecture

The mandated diagram set covering each platform layer plus cross-layer event flow.
Notation, colours and shapes follow the [diagram legend](./diagram-legend.md). For the
high-level system overview, ERD and auth/real-time sequences, see
[system-overview.md](./system-overview.md).

---

## 1. Client Architecture

Apple/web client surfaces, local storage, widgets and the API boundary. Clients talk
to the backend **only** — never to databases, AI infrastructure or IoT directly.

```mermaid
---
title: "PRVIO Earth — Client Architecture (v1.0.0, 2026-06-18)"
---
graph TD
  subgraph ClientBoundary["Client trust boundary (user devices)"]
    direction TB
    subgraph Apps["Applications"]
      WEB("Web App\nNext.js + Tailwind")
      IOS("SwiftUI Apps\niPhone · iPad · Mac · Watch · Vision")
    end
    subgraph Presentation["Presentation"]
      VIEWS["Liquid Glass UI\n(views / components)"]
      TWINVIZ["Digital Twin\nvisualization"]
    end
    subgraph LocalState["Local state"]
      CACHE[("Local cache\noffline-first")]
      KEYS[("Secure storage\nKeychain / Secure Enclave")]
    end
    subgraph Extensions["OS integration"]
      WIDGETS["Widgets &\nLive Activities"]
      INTENTS["App Intents /\nnotifications"]
    end
  end

  GATEWAY[["Backend API Gateway\nversioned /api/v1"]]

  WEB --> VIEWS
  IOS --> VIEWS
  VIEWS --> TWINVIZ
  VIEWS --> CACHE
  IOS --> KEYS
  WIDGETS --> CACHE
  INTENTS --> WIDGETS

  VIEWS -->|"HTTPS / REST · GraphQL"| GATEWAY
  VIEWS -.->|"WebSocket subscriptions"| GATEWAY
  KEYS -->|"device attestation / JWT"| GATEWAY

  classDef client fill:#D7E8FF,stroke:#2563EB,color:#0A1F44;
  classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;
  classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;
  class WEB,IOS,VIEWS,TWINVIZ,WIDGETS,INTENTS client;
  class CACHE,KEYS store;
  class GATEWAY backend;
```

## 2. Backend Architecture

System of record: API gateway, identity, core domain services, data + event
infrastructure, and integration gateways behind a trust boundary.

```mermaid
---
title: "PRVIO Earth — Backend Architecture (v1.0.0, 2026-06-18)"
---
graph TD
  CLIENTS("Clients\n(web + native)")

  subgraph BackendBoundary["Backend trust boundary"]
    GATEWAY[["API Gateway + WAF\nrate limiting · versioning"]]
    IAM["Identity & Access\nauth · RBAC/ABAC · policy"]
    subgraph Services["Domain services"]
      PROP["Property / Asset"]
      MAINT["Maintenance / Tasks"]
      COMMS["Communication"]
      DOCS["Documents"]
      COMPLIANCE["Audit & Compliance"]
    end
    BUS[["Event Bus"]]
    DB[("PostgreSQL\nRLS-enabled")]
    OBJ[("Object Storage\ndocuments · media")]
    INTEG[["Integration Gateways"]]
  end

  AISVC["AI Layer"]
  TWIN["Digital Twin Layer"]
  EXT{{"External systems\nHome Assistant · IoT · 3rd-party"}}

  CLIENTS -->|"HTTPS / WS"| GATEWAY
  GATEWAY --> IAM
  IAM -->|"authorized"| Services
  Services --> DB
  Services --> OBJ
  Services -.->|"domain events"| BUS
  COMPLIANCE -->|"immutable audit"| DB

  BUS -.->|"secured contract"| AISVC
  BUS -.->|"sync events"| TWIN
  Services -->|"service contract"| AISVC
  INTEG --> EXT
  Services --> INTEG

  classDef client fill:#D7E8FF,stroke:#2563EB,color:#0A1F44;
  classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;
  classDef ai fill:#E8DCFF,stroke:#7C3AED,color:#2B1259;
  classDef twin fill:#CFF6FA,stroke:#0E7490,color:#06303A;
  classDef integration fill:#FFE9C7,stroke:#D97706,color:#3D2606;
  classDef external fill:#ECEDF2,stroke:#64748B,color:#1E293B;
  classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;
  class CLIENTS client;
  class GATEWAY,IAM,PROP,MAINT,COMMS,DOCS,COMPLIANCE,BUS backend;
  class DB,OBJ store;
  class INTEG integration;
  class AISVC ai;
  class TWIN twin;
  class EXT external;
```

## 3. AI Architecture

Assistant orchestration with retrieval, knowledge stores, allowlisted tools and safety
controls. All access is brokered by backend authorization; BYO models are supported.

```mermaid
---
title: "PRVIO Earth — AI Architecture (v1.0.0, 2026-06-18)"
---
graph TD
  BACKEND["Backend Services\n(policy + authorization)"]

  subgraph AIBoundary["AI trust boundary"]
    ORCH["AI Orchestrator\nleast privilege"]
    GUARD["Safety controls\nprompt isolation · output validation\nmoderation · deny-by-default tools"]
    RAG["Retrieval (RAG)\nbackend-scoped access"]
    KNOW[("Knowledge store\npgvector embeddings")]
    TOOLS[["Allowlisted tools\nscoped · rate-limited"]]
  end

  MODELS{{"Model providers\nClaude · BYO models"}}

  BACKEND -->|"authorized request"| ORCH
  ORCH --> GUARD
  GUARD --> RAG
  RAG -->|"authorized retrieval"| KNOW
  RAG -->|"vector search via backend"| BACKEND
  ORCH -->|"completion"| MODELS
  ORCH -->|"validated calls"| TOOLS
  TOOLS -->|"backend-validated actions"| BACKEND
  ORCH -.->|"insights / recommendations (events)"| BACKEND

  classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;
  classDef ai fill:#E8DCFF,stroke:#7C3AED,color:#2B1259;
  classDef external fill:#ECEDF2,stroke:#64748B,color:#1E293B;
  classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;
  class BACKEND backend;
  class ORCH,GUARD,RAG,TOOLS ai;
  class KNOW store;
  class MODELS external;
```

## 4. Digital Twin Architecture

Spatial services, asset models, telemetry ingestion and visualization pipelines that
synchronize with Home Assistant / IoT through backend-managed contracts.

```mermaid
---
title: "PRVIO Earth — Digital Twin Architecture (v1.0.0, 2026-06-18)"
---
graph TD
  BACKEND["Backend Services"]
  CLIENTS("Clients\n(visualization)")

  subgraph TwinBoundary["Digital Twin trust boundary"]
    SPATIAL["Spatial services\ngeospatial relationships"]
    ASSETS["Asset models\n3D / infrastructure"]
    INGEST[["Telemetry ingestion"]]
    TSDB[("Time-series store")]
    VIZ["Visualization pipeline\noptimized scene data"]
    SIM["Estate simulation /\noperational monitoring"]
  end

  INTEG[["Integration Gateways"]]
  IOT{{"Home Assistant · IoT sensors"}}

  IOT -->|"MQTT / HTTP"| INTEG
  INTEG ==>|"telemetry"| INGEST
  INGEST ==> TSDB
  BACKEND -->|"authoritative data"| SPATIAL
  SPATIAL --> ASSETS
  TSDB --> SIM
  ASSETS --> VIZ
  SIM --> VIZ
  VIZ -->|"optimized scene"| CLIENTS
  SPATIAL -.->|"state / spatial events"| BACKEND

  classDef client fill:#D7E8FF,stroke:#2563EB,color:#0A1F44;
  classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;
  classDef twin fill:#CFF6FA,stroke:#0E7490,color:#06303A;
  classDef integration fill:#FFE9C7,stroke:#D97706,color:#3D2606;
  classDef external fill:#ECEDF2,stroke:#64748B,color:#1E293B;
  classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;
  class CLIENTS client;
  class BACKEND backend;
  class SPATIAL,ASSETS,INGEST,VIZ,SIM twin;
  class TSDB store;
  class INTEG integration;
  class IOT external;
```

## 5. Event Flow Architecture

Domain events, producers/consumers, the bus, real-time subscriptions and retry paths
across layers. Events are versioned; failures route to a dead-letter queue.

```mermaid
---
title: "PRVIO Earth — Event Flow Architecture (v1.0.0, 2026-06-18)"
---
graph LR
  subgraph Producers["Producers"]
    SVC["Domain services"]
    TWIN["Digital Twin"]
    AIP["AI insights"]
    IOTP{{"IoT / Home Assistant"}}
  end

  BUS[["Event Bus\nversioned domain events"]]
  DLQ[("Dead-letter queue")]
  RT[["Realtime channels\nWebSocket"]]

  subgraph Consumers["Consumers"]
    AUTO["Automation engine"]
    NOTIF["Notifications"]
    AUDIT[("Audit log\nimmutable")]
    TWINC["Digital Twin sync"]
    CLIENTS("Clients")
  end

  SVC -.->|"publish"| BUS
  TWIN -.->|"state events"| BUS
  AIP -.->|"recommendations"| BUS
  IOTP -.->|"telemetry events"| BUS

  BUS -.-> AUTO
  BUS -.-> NOTIF
  BUS -.->|"every event"| AUDIT
  BUS -.-> TWINC
  BUS -.->|"subscribe"| RT
  RT -.->|"live update"| CLIENTS
  BUS -.->|"retry exhausted"| DLQ
  AUTO -.->|"derived events"| BUS

  classDef client fill:#D7E8FF,stroke:#2563EB,color:#0A1F44;
  classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;
  classDef ai fill:#E8DCFF,stroke:#7C3AED,color:#2B1259;
  classDef twin fill:#CFF6FA,stroke:#0E7490,color:#06303A;
  classDef external fill:#ECEDF2,stroke:#64748B,color:#1E293B;
  classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;
  class SVC,BUS,RT,AUTO,NOTIF backend;
  class TWIN,TWINC twin;
  class AIP ai;
  class IOTP,CLIENTS external;
  class DLQ,AUDIT store;
```

---

## 6. Energy & Smart-Home Architecture

The Energy module and the Home-Assistant-fed smart-home surfaces. Readings flow
over a real event bus (`prvio-energy` Supabase Realtime broadcast) and persist to
the `energy_readings` time-series; clients subscribe via `useEnergyLive` and
degrade to an on-device simulation. The HA gateway brokers all IoT — clients
never talk to devices directly.

```mermaid
graph TD
  subgraph Producers["Producers"]
    GW["Home Assistant gateway<br/>(Matter/Thread/Zigbee/Z-Wave/Wi-Fi)"]
    PUB["energy-publisher.mjs / cron"]
    API["POST /api/v1/twin/energy"]
  end

  subgraph BackendBoundary["Backend trust boundary"]
    CH["prvio-energy<br/>Realtime broadcast channel"]
    ER[("energy_readings<br/>time-series · RLS")]
    AISUM["POST /api/v1/ai/summarize<br/>(guardrails + audit)"]
  end

  subgraph ClientBoundary["Client trust boundary"]
    HOOK["useEnergyLive / useEnergyHistory"]
    SIM["on-device simulation<br/>(fallback)"]
    LIVE["Energy → Live<br/>flow particles + pairwise routes"]
    PW["Powerwall · live card"]
    FP["Floorplan<br/>rooms · presence · chips"]
    DOC["Documents → AI Summary"]
    BYO["Assistant → bring-your-own-model"]
  end

  GW --> CH
  PUB --> CH
  API --> CH
  API --> ER
  CH -->|"broadcast state"| HOOK
  ER -->|"?history"| HOOK
  HOOK -->|"no live data"| SIM
  HOOK --> LIVE
  HOOK --> PW
  HOOK --> FP
  GW -.->|"telemetry"| ER
  DOC -->|"prefer backend"| AISUM
  AISUM -.->|"503 → fallback"| DOC
  BYO -.->|"custom endpoint/key"| AISUM

  classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;
  classDef client fill:#D7E8FF,stroke:#2563EB,color:#0A1F44;
  classDef external fill:#ECEDF2,stroke:#64748B,color:#1E293B;
  classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;
  class CH,AISUM backend;
  class HOOK,SIM,LIVE,PW,FP,DOC,BYO client;
  class GW,PUB,API external;
  class ER store;
```

**Notes**
- **Source badges** — every surface shows Live/Simulat (energy), Synced/Demo
  (history) or Backend AI / On-device (summaries) so the active feed is explicit.
- **Dynamic tariff** — `chargeWhenCheap` schedules EV/Powerwall charging into the
  cheapest tariff window; OCPP-style sessions track delivered energy on the EV.
- **Powercalc** — per-device wattage in the House breakdown is virtual (no meters).
