import { describe, it, expect } from "vitest";
import { LOCALES } from "../app/lib/i18n";

/**
 * The dictionary itself is private to the provider module; here we assert the
 * public locale surface stays sane. Key parity between EN and RO is enforced at
 * compile time by the `Record<MessageKey, string>` type on the RO dictionary.
 */
describe("i18n locales", () => {
  it("exposes English and Romanian as selectable locales", () => {
    const ids = LOCALES.map((l) => l.id);
    expect(ids).toContain("en");
    expect(ids).toContain("ro");
  });

  it("gives every locale a label, native name and flag", () => {
    for (const l of LOCALES) {
      expect(l.label.length).toBeGreaterThan(0);
      expect(l.native.length).toBeGreaterThan(0);
      expect(l.flag.length).toBeGreaterThan(0);
    }
  });
});
