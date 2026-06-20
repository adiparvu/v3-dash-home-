import { describe, it, expect } from "vitest";
import { summarize, budgetStatus, demoExpenses, type Expense } from "../app/lib/budget";

const sample: Expense[] = [
  { id: "1", label: "A", amount: 100, category: "Maintenance", zone: "House", date: "2026-06-04", source: "receipt" },
  { id: "2", label: "B", amount: 50, category: "Garden", zone: "Garden", date: "2026-06-08", source: "bank" },
  { id: "3", label: "C", amount: 200, category: "Maintenance", zone: "Estate", date: "2026-05-10", source: "bank" },
];

describe("summarize", () => {
  const s = summarize(sample, new Date("2026-06-20"));

  it("totals all expenses", () => {
    expect(s.total).toBe(350);
  });

  it("sums the current month only for thisMonth", () => {
    expect(s.thisMonth).toBe(150); // June: 100 + 50
  });

  it("groups by category, sorted desc, with percentages", () => {
    expect(s.byCategory[0]).toMatchObject({ category: "Maintenance", amount: 300 });
    expect(s.byCategory[0].pct).toBe(86); // 300/350
  });

  it("builds an ascending monthly trend", () => {
    expect(s.monthly.map((m) => m.month)).toEqual(["2026-05", "2026-06"]);
    expect(s.monthly[1].amount).toBe(150);
  });
});

describe("budgetStatus", () => {
  it("reports remaining and percentage under budget", () => {
    const st = budgetStatus(150, 800);
    expect(st.over).toBe(false);
    expect(st.remaining).toBe(650);
    expect(st.pct).toBe(19);
  });
  it("flags going over budget", () => {
    const st = budgetStatus(900, 800);
    expect(st.over).toBe(true);
    expect(st.remaining).toBe(-100);
  });
});

describe("demoExpenses", () => {
  it("produces a non-empty, well-formed dataset", () => {
    const ex = demoExpenses(new Date("2026-06-20"));
    expect(ex.length).toBeGreaterThan(0);
    expect(ex.every((e) => e.amount > 0 && e.category && e.zone)).toBe(true);
  });
});
