# PRVIO Earth — Architecture Diagram Legend & Notation Guide

**Version:** v1.0.0
**Last updated:** 2026-06-18
**Author:** PRVIO Earth Architecture

This legend defines the shared notation for every PRVIO Earth architecture diagram.
Diagrams are authored as **Mermaid** (diagrams-as-code) and kept in version control
alongside the application. Each diagram must carry a title, version and last-updated
date, identify trust boundaries and external systems, and remain readable in light and
dark modes.

---

## 1. Standardized colour palette

Apply the same fill per layer across all diagrams. Colours are chosen for adequate
contrast against both light and dark documentation themes; node text is dark.

| Domain | Fill | Stroke | Mermaid `classDef` |
| --- | --- | --- | --- |
| Client | `#D7E8FF` | `#2563EB` | `classDef client fill:#D7E8FF,stroke:#2563EB,color:#0A1F44;` |
| Backend | `#D6F5E3` | `#15803D` | `classDef backend fill:#D6F5E3,stroke:#15803D,color:#06301B;` |
| AI | `#E8DCFF` | `#7C3AED` | `classDef ai fill:#E8DCFF,stroke:#7C3AED,color:#2B1259;` |
| Digital Twin | `#CFF6FA` | `#0E7490` | `classDef twin fill:#CFF6FA,stroke:#0E7490,color:#06303A;` |
| Integration | `#FFE9C7` | `#D97706` | `classDef integration fill:#FFE9C7,stroke:#D97706,color:#3D2606;` |
| External | `#ECEDF2` | `#64748B` | `classDef external fill:#ECEDF2,stroke:#64748B,color:#1E293B;` |
| Data store | `#FAD9E6` | `#BE185D` | `classDef store fill:#FAD9E6,stroke:#BE185D,color:#3F0A22;` |

## 2. Shapes

| Shape | Meaning |
| --- | --- |
| Rectangle `[ ]` | Service, application or process |
| Rounded `( )` | Client/UI surface or entry point |
| Cylinder `[( )]` | Database / persistent store |
| Subroutine `[[ ]]` | Gateway / bus / queue |
| Hexagon `{{ }}` | External system or third-party integration |
| Dashed subgraph | Trust boundary / ownership domain |

## 3. Edges

- **Solid arrow `-->`** — synchronous request/response (HTTPS/REST, GraphQL, SDK).
- **Dashed arrow `-.->`** — asynchronous event / publish-subscribe.
- **Thick arrow `==>`** — bulk / streaming data (telemetry, exports).
- Every major edge is **labelled** with protocol or intent (e.g. `JWT`, `WebSocket`,
  `domain event`, `MQTT`).

## 4. Trust boundaries

Trust boundaries are drawn as labelled `subgraph` blocks. Crossing a boundary always
implies authentication + backend-enforced authorization. The **Client → Backend only**
rule means no client edge may cross directly into the AI, Digital Twin or data-store
boundaries.

## 5. Conventions

- Layer ordering top→bottom: Client → Backend → (AI / Digital Twin) → External.
- One concern per diagram; cross-reference rather than duplicate nodes.
- Update diagrams **before** merging architectural changes; stale diagrams are
  treated as documentation defects (see [ROADMAP.md](../ROADMAP.md)).
