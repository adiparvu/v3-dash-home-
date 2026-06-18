/**
 * Document understanding & summarization (spec: AI Layer → document
 * understanding and summarization).
 *
 * Document content is treated as untrusted input (spec: "treat all prompts,
 * retrieved content, documents ... as untrusted"). This on-device stand-in
 * produces a grounded, schema-validated summary from the document's metadata;
 * in the real platform the same contract is fulfilled by the backend-brokered
 * AI orchestrator over the actual file contents.
 */

import { validateOutput } from "./guardrails";

export type DocInput = {
  name: string;
  category: string;
  type: string;
  zone: string;
  date: string;
};

export type DocSummary = {
  summary: string;
  keyPoints: string[];
  entities: { label: string; value: string }[];
  /** True if output moderation redacted anything resembling a secret. */
  redacted: boolean;
};

/** Documented retention period per document category (mirrors the privacy schedule). */
const RETENTION: Record<string, string> = {
  Legal: "Retained (legally required)",
  Financial: "7 years (compliance)",
  Technical: "Until superseded",
  Manuals: "Lifetime of asset",
};

const TEMPLATES: Record<string, (d: DocInput) => { summary: string; keyPoints: string[] }> = {
  Legal: (d) => ({
    summary: `“${d.name}” is a legal record for the ${d.zone} scope, filed ${d.date}. It establishes rights, obligations and ownership terms that should be preserved for estate continuity and any future ownership transfer.`,
    keyPoints: [
      "Defines parties, rights and obligations",
      "Relevant to ownership-transfer and continuity workflows",
      "Should be verified against current title records",
    ],
  }),
  Financial: (d) => ({
    summary: `“${d.name}” is a financial document covering the ${d.zone} scope, dated ${d.date}. It contains monetary figures and period reporting used for valuation and budgeting.`,
    keyPoints: [
      "Contains monetary figures and reporting period",
      "Feeds property value tracking and budgeting",
      "Review for variances against prior periods",
    ],
  }),
  Technical: (d) => ({
    summary: `“${d.name}” is a technical document for the ${d.zone} zone, dated ${d.date}. It describes infrastructure, layout or specifications useful for maintenance and the digital-twin model.`,
    keyPoints: [
      "Describes infrastructure / layout / specifications",
      "Useful for maintenance planning and the digital twin",
      "Cross-reference with related assets and sensors",
    ],
  }),
  Manuals: (d) => ({
    summary: `“${d.name}” is an operating manual for the ${d.zone} zone, dated ${d.date}. It documents operating procedures and recommended maintenance intervals for the related equipment.`,
    keyPoints: [
      "Operating procedures and safety guidance",
      "Recommended maintenance intervals",
      "Link to the relevant asset for scheduled service",
    ],
  }),
};

/** Summarize a document from its metadata, with output moderation applied. */
export function summarizeDocument(doc: DocInput): DocSummary {
  const tpl = TEMPLATES[doc.category] ?? ((d: DocInput) => ({
    summary: `“${d.name}” (${d.type}) is filed under ${d.category} for the ${d.zone} scope, dated ${d.date}.`,
    keyPoints: ["Filed for the estate", "Review for relevance", "Categorize and retain per policy"],
  }));

  const { summary, keyPoints } = tpl(doc);
  const moderated = validateOutput(summary);

  const entities = [
    { label: "Document type", value: doc.type },
    { label: "Category", value: doc.category },
    { label: "Related scope", value: doc.zone },
    { label: "Dated", value: doc.date },
    { label: "Retention", value: RETENTION[doc.category] ?? "Per policy" },
  ];

  return { summary: moderated.text, keyPoints, entities, redacted: moderated.redacted };
}
