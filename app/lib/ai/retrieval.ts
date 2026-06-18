/**
 * AI retrieval layer (spec: AI Layer → retrieval-augmented estate knowledge).
 *
 * A scope-controlled, deny-by-default retriever over the estate knowledge base.
 * In the real platform this is brokered by backend authorization against
 * pgvector embeddings; here it is an on-device stand-in that enforces the same
 * contract: a chunk is only ever returned if its scope is in the caller's
 * explicitly authorized scope set. Every result carries provenance so answers
 * remain attributable and auditable.
 */

export type KnowledgeScope =
  | "zones"
  | "assets"
  | "tasks"
  | "maintenance"
  | "sensors"
  | "overview";

/** All scopes an estate owner is authorized to retrieve from their own tenant. */
export const OWNER_SCOPES: KnowledgeScope[] = [
  "zones",
  "assets",
  "tasks",
  "maintenance",
  "sensors",
  "overview",
];

export type KnowledgeChunk = {
  id: string;
  scope: KnowledgeScope;
  title: string;
  content: string;
  keywords: string[];
};

export type RetrievedChunk = KnowledgeChunk & { score: number };

/**
 * On-device estate knowledge base. Each chunk is tagged with the scope that
 * gates access to it. Tenant isolation is implicit: this KB only ever holds the
 * signed-in owner's data.
 */
const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  { id: "kb-forest", scope: "zones", title: "Forest zone", content: "The Forest zone is in good shape — health score 91/100, biodiversity high, ~2,543 trees tracked. No action needed this week.", keywords: ["forest", "tree", "biodiversity", "woodland"] },
  { id: "kb-lake", scope: "zones", title: "Lake zone", content: "Lake zone: water quality Excellent, temperature 18.4°C, pH 7.2, fish population healthy. Health score 95/100.", keywords: ["lake", "water", "fish", "ph"] },
  { id: "kb-greenhouse", scope: "zones", title: "Greenhouse zone", content: "Greenhouse: 24.3°C, humidity 65%. CO₂ is 800 ppm — slightly above the 600–700 optimal range. Opening the vents is recommended; the 'Greenhouse Temperature Alert' automation triggers at 30°C.", keywords: ["greenhouse", "co2", "co₂", "humidity", "vent"] },
  { id: "kb-orchard", scope: "zones", title: "Orchard zone", content: "Orchard: projected harvest in ~23 days, estimated yield 12.4 t, flowering at 75%. Irrigation is optimal and disease risk is low.", keywords: ["orchard", "harvest", "apple", "yield", "flowering"] },
  { id: "kb-pond", scope: "zones", title: "Smart pond", content: "Smart Pond: pH 7.4, dissolved O₂ 8.2 mg/L, health 96/100. Auto-feeder ran twice today.", keywords: ["pond", "oxygen", "feeder", "fish"] },
  { id: "kb-zones-count", scope: "overview", title: "Zone summary", content: "The estate spans 26 base zones. Overall estate health is 87/100 — Very Good.", keywords: ["zone", "zones", "count", "how many"] },
  { id: "kb-assets", scope: "assets", title: "Inventory summary", content: "Inventory holds 140 base assets: 118 active, 7 in maintenance, 3 offline.", keywords: ["asset", "assets", "object", "inventory", "equipment"] },
  { id: "kb-tasks", scope: "tasks", title: "Open tasks", content: "There are pending tasks — the highest priority is 'Irrigation System Maintenance' (Orchard), due today.", keywords: ["task", "tasks", "todo", "to-do", "pending", "due"] },
  { id: "kb-maintenance", scope: "maintenance", title: "Maintenance schedule", content: "Next maintenance: Lake pump filter replacement is scheduled. The pump's last run was 5h ago at 97% success.", keywords: ["maintenance", "pump", "service", "filter", "repair"] },
  { id: "kb-sensors", scope: "sensors", title: "Sensor alerts", content: "3 active alerts: irrigation maintenance due (3 days), greenhouse CO₂ above optimal, and orchard irrigation warranty expiring.", keywords: ["alert", "sensor", "warning", "problem", "reading"] },
  { id: "kb-overview", scope: "overview", title: "Estate overview", content: "Estate overview: health 87/100 (Very Good), 26 zones, 140 assets, 3 active alerts. Main watch item is greenhouse CO₂.", keywords: ["overview", "health", "status", "score", "summary"] },
];

/**
 * Retrieve the most relevant knowledge chunks for a query, restricted to the
 * caller's authorized scopes. Chunks outside the authorized scope set are never
 * returned (deny-by-default), modelling backend-enforced retrieval access control.
 */
export function retrieve(
  query: string,
  authorizedScopes: KnowledgeScope[],
  limit = 3
): RetrievedChunk[] {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9₂₃]+/i).filter((t) => t.length > 2);
  const allowed = new Set(authorizedScopes);

  return KNOWLEDGE_BASE
    .filter((c) => allowed.has(c.scope))
    .map((c) => {
      let score = 0;
      for (const kw of c.keywords) {
        if (q.includes(kw)) score += 2;
        if (tokens.includes(kw)) score += 1;
      }
      return { ...c, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
