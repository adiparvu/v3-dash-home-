# PRVIO Earth — System Architecture

**Version:** v1.0.0  
**Date:** 2026-06-17

---

## 1. System Overview

Four-layer architecture: Client → Backend/Supabase → AI → Digital Twin.

```mermaid
---
title: "PRVIO Earth — System Overview (v1.0.0, 2026-06-17)"
---
graph TD
  subgraph Client["Client Layer (Next.js 14 App Router)"]
    WEB["Web Browser\n(React + Tailwind CSS)"]
    PWA["PWA / Mobile"]
    QR["QR Code Scanner"]
  end

  subgraph Backend["Backend Layer (Supabase)"]
    AUTH["Auth\n(email / OAuth)"]
    DB["PostgreSQL\n(RLS-enabled)"]
    RT["Realtime\n(WebSocket channels)"]
    STORAGE["Object Storage\n(documents, images)"]
    EDGE["Edge Functions\n(Deno)"]
  end

  subgraph AI["AI Layer"]
    LLM["Claude API\n(Anthropic)"]
    RAG["RAG / Embeddings\n(pgvector)"]
    AGENT["AI Agent\n(tool use + memory)"]
  end

  subgraph DT["Digital Twin Layer"]
    MAP["2D/3D Property Map"]
    SENSORS["IoT Sensor Network"]
    TELEMETRY["Time-Series Telemetry"]
    AUTOMATIONS["Automation Engine"]
  end

  WEB   -->|HTTPS / REST| AUTH
  WEB   -->|Supabase JS SDK| DB
  WEB   -->|WebSocket| RT
  PWA   -->|HTTPS| AUTH
  QR    -->|scan → lookup| DB

  AUTH  -->|JWT| DB
  DB    -->|row changes| RT
  EDGE  -->|read / write| DB
  EDGE  -->|HTTP| LLM

  WEB   -->|chat API route| AGENT
  AGENT -->|completion| LLM
  AGENT -->|context retrieval| RAG
  RAG   -->|vector search| DB

  SENSORS    -->|MQTT / HTTP| EDGE
  EDGE       -->|insert| TELEMETRY
  TELEMETRY  -->|stored in| DB
  DB         -->|live data| MAP
  DB         -->|trigger eval| AUTOMATIONS
  AUTOMATIONS -->|push| RT
  RT         -->|live update| WEB
```

---

## 2. Database Entity Relationship Diagram

Simplified ERD showing primary table relationships.

```mermaid
---
title: "PRVIO Earth — Database ERD (v1.0.0, 2026-06-17)"
---
erDiagram
  profiles {
    uuid id PK
    text email
    text full_name
    bool onboarding_completed
  }

  properties {
    uuid id PK
    uuid owner_id FK
    text name
    numeric total_area_sqm
    bool is_active
  }

  parcels {
    uuid id PK
    uuid property_id FK
    text name
    numeric area_sqm
  }

  zones {
    uuid id PK
    uuid property_id FK
    uuid parcel_id FK
    text name
    zone_type type
  }

  assets {
    uuid id PK
    uuid property_id FK
    uuid zone_id FK
    text name
    asset_category category
  }

  asset_qr_codes {
    uuid id PK
    uuid asset_id FK
    text code
    int scan_count
  }

  tasks {
    uuid id PK
    uuid property_id FK
    uuid zone_id FK
    uuid asset_id FK
    task_status status
    task_priority priority
  }

  sensors {
    uuid id PK
    uuid property_id FK
    uuid zone_id FK
    sensor_type type
    bool is_active
  }

  telemetry {
    uuid id PK
    uuid sensor_id FK
    numeric value
    timestamptz recorded_at
  }

  automations {
    uuid id PK
    uuid property_id FK
    text trigger_type
    bool is_active
  }

  documents {
    uuid id PK
    uuid property_id FK
    uuid asset_id FK
    text file_url
  }

  contractors {
    uuid id PK
    uuid property_id FK
    text name
    numeric rating
  }

  maintenance_records {
    uuid id PK
    uuid property_id FK
    uuid asset_id FK
    uuid task_id FK
    uuid contractor_id FK
    timestamptz performed_at
  }

  notifications {
    uuid id PK
    uuid user_id FK
    uuid property_id FK
    text type
    bool is_read
  }

  chat_messages {
    uuid id PK
    uuid property_id FK
    uuid user_id FK
    text role
    text content
  }

  profiles        ||--o{ properties          : "owns"
  properties      ||--o{ parcels             : "contains"
  properties      ||--o{ zones               : "contains"
  parcels         ||--o{ zones               : "subdivided into"
  properties      ||--o{ assets              : "has"
  zones           ||--o{ assets              : "located in"
  assets          ||--o{ asset_qr_codes      : "identified by"
  properties      ||--o{ tasks               : "has"
  zones           ||--o{ tasks               : "relates to"
  assets          ||--o{ tasks               : "relates to"
  properties      ||--o{ sensors             : "has"
  zones           ||--o{ sensors             : "monitors"
  sensors         ||--o{ telemetry           : "emits"
  properties      ||--o{ automations         : "runs"
  properties      ||--o{ documents           : "stores"
  assets          ||--o{ documents           : "documented by"
  properties      ||--o{ contractors         : "employs"
  properties      ||--o{ maintenance_records : "tracks"
  assets          ||--o{ maintenance_records : "maintained via"
  tasks           ||--o{ maintenance_records : "generates"
  contractors     ||--o{ maintenance_records : "performs"
  profiles        ||--o{ notifications       : "receives"
  properties      ||--o{ chat_messages       : "has"
  profiles        ||--o{ chat_messages       : "sends"
```

---

## 3. Authentication Flow

OAuth and magic-link flows via Supabase Auth with Next.js middleware session handling.

```mermaid
---
title: "PRVIO Earth — Authentication Flow (v1.0.0, 2026-06-17)"
---
sequenceDiagram
  actor User
  participant Browser as Next.js Browser
  participant Middleware as Next.js Middleware
  participant Supabase as Supabase Auth
  participant DB as PostgreSQL

  User->>Browser: Navigate to /dashboard
  Browser->>Middleware: Request (no session cookie)
  Middleware->>Supabase: Verify session token
  Supabase-->>Middleware: 401 – no valid session
  Middleware-->>Browser: Redirect → /login

  User->>Browser: Submit email / OAuth
  Browser->>Supabase: signInWithOAuth() or signInWithOtp()
  Supabase-->>Browser: Auth code / magic link

  User->>Browser: Click magic link or OAuth callback
  Browser->>Supabase: Exchange code → access + refresh tokens
  Supabase-->>Browser: Set session cookies (HttpOnly)

  Note over Supabase,DB: First sign-in only
  Supabase->>DB: INSERT into auth.users
  DB->>DB: TRIGGER on_auth_user_created
  DB->>DB: INSERT into public.profiles

  Browser->>Middleware: Request /dashboard (with session cookie)
  Middleware->>Supabase: Verify session token
  Supabase-->>Middleware: 200 – valid session + user claims
  Middleware-->>Browser: Allow request
  Browser-->>User: Render /dashboard

  Note over Browser,Supabase: Token refresh
  Browser->>Supabase: Access token expired → use refresh token
  Supabase-->>Browser: New access + refresh tokens
```

---

## 4. Real-time Data Flow

Sensor telemetry ingestion and live dashboard updates via Supabase Realtime.

```mermaid
---
title: "PRVIO Earth — Real-time Data Flow (v1.0.0, 2026-06-17)"
---
sequenceDiagram
  participant IoT as IoT Sensor
  participant Edge as Supabase Edge Function
  participant DB as PostgreSQL
  participant RT as Supabase Realtime
  participant Dashboard as Next.js Dashboard
  participant Automation as Automation Engine

  IoT->>Edge: POST /functions/v1/ingest-telemetry\n{ sensor_id, value, timestamp }
  Edge->>Edge: Validate + authenticate device
  Edge->>DB: INSERT INTO telemetry
  DB-->>RT: WAL change event (row insert)
  RT-->>Dashboard: Broadcast to channel\n"property:{id}:telemetry"
  Dashboard-->>Dashboard: Update live chart

  DB->>DB: Check automation trigger conditions
  alt Threshold exceeded
    DB->>DB: INSERT INTO notifications
    DB-->>RT: Notification insert event
    RT-->>Dashboard: Broadcast to channel\n"user:{id}:notifications"
    Dashboard-->>Dashboard: Show toast alert
  end

  Note over Dashboard,RT: Task & asset updates
  Dashboard->>DB: PATCH /tasks/{id} → status=completed
  DB-->>RT: WAL change event (row update)
  RT-->>Dashboard: Broadcast to subscribed clients
  Dashboard-->>Dashboard: Optimistic UI reconcile
```
