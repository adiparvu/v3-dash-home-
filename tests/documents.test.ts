import { describe, it, expect } from "vitest";
import { summarizeDocument } from "../app/lib/ai/documents";

describe("document summarization", () => {
  it("produces a grounded, schema-shaped summary", () => {
    const out = summarizeDocument({ name: "Deed of Estate.pdf", category: "Legal", type: "PDF", zone: "Estate", date: "2024-01-12" });
    expect(typeof out.summary).toBe("string");
    expect(out.summary.length).toBeGreaterThan(0);
    expect(Array.isArray(out.keyPoints)).toBe(true);
    expect(Array.isArray(out.entities)).toBe(true);
    expect(typeof out.redacted).toBe("boolean");
  });
});
