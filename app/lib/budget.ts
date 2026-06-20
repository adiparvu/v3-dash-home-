/**
 * Estate budget & expenses (pure, testable).
 *
 * Aggregates expenses "imported" from the Receipt Scanner and banking
 * integrations into category/zone breakdowns, a monthly trend and budget status.
 * Demo data stands in for the real imports; the same shapes back live feeds.
 */

export type ExpenseSource = "receipt" | "bank" | "manual";

export type Expense = {
  id: string;
  label: string;
  amount: number; // EUR
  category: string;
  zone: string;
  /** ISO date. */
  date: string;
  source: ExpenseSource;
};

export const EXPENSE_CATEGORIES = ["Maintenance", "Garden", "Utilities", "Improvement", "Supplies", "Other"] as const;

export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Maintenance: { icon: "🔧", color: "#F59E0B" },
  Garden: { icon: "🌱", color: "#4ADE80" },
  Utilities: { icon: "💡", color: "#22D3EE" },
  Improvement: { icon: "🏗️", color: "#7C3AED" },
  Supplies: { icon: "📦", color: "#9CA3AF" },
  Other: { icon: "•", color: "#9CA3AF" },
};

/** Demo expenses relative to a base date (so the trend has recent months). */
export function demoExpenses(base: Date = new Date()): Expense[] {
  const d = (monthsAgo: number, day: number) => {
    const x = new Date(base.getFullYear(), base.getMonth() - monthsAgo, day);
    return x.toISOString().slice(0, 10);
  };
  return [
    { id: "e1", label: "Roof repair", amount: 420, category: "Improvement", zone: "House", date: d(0, 4), source: "receipt" },
    { id: "e2", label: "Garden center", amount: 62.1, category: "Garden", zone: "Garden", date: d(0, 8), source: "bank" },
    { id: "e3", label: "Electricity bill", amount: 186, category: "Utilities", zone: "Estate", date: d(0, 5), source: "bank" },
    { id: "e4", label: "HVAC filters", amount: 58, category: "Maintenance", zone: "Greenhouse", date: d(0, 12), source: "receipt" },
    { id: "e5", label: "Pool chemicals", amount: 44.5, category: "Supplies", zone: "Smart Pond", date: d(1, 18), source: "receipt" },
    { id: "e6", label: "Irrigation parts", amount: 134.2, category: "Maintenance", zone: "Orchard", date: d(1, 9), source: "bank" },
    { id: "e7", label: "Water bill", amount: 73, category: "Utilities", zone: "Estate", date: d(1, 6), source: "bank" },
    { id: "e8", label: "Paint & supplies", amount: 96.4, category: "Improvement", zone: "House", date: d(2, 22), source: "receipt" },
    { id: "e9", label: "Tree pruning", amount: 210, category: "Garden", zone: "Forest", date: d(2, 14), source: "bank" },
    { id: "e10", label: "Electricity bill", amount: 201, category: "Utilities", zone: "Estate", date: d(2, 5), source: "bank" },
    { id: "e11", label: "Solar panel cleaning", amount: 120, category: "Maintenance", zone: "Estate", date: d(3, 11), source: "bank" },
    { id: "e12", label: "Greenhouse glazing", amount: 340, category: "Improvement", zone: "Greenhouse", date: d(3, 19), source: "receipt" },
  ];
}

function monthKey(iso: string): string {
  return iso.slice(0, 7); // YYYY-MM
}

export type BudgetSummary = {
  total: number;
  thisMonth: number;
  byCategory: { category: string; amount: number; pct: number }[];
  byZone: { zone: string; amount: number }[];
  /** Most-recent-last month totals. */
  monthly: { month: string; amount: number }[];
};

export function summarize(expenses: Expense[], now: Date = new Date()): BudgetSummary {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonth = expenses.filter((e) => monthKey(e.date) === thisKey).reduce((s, e) => s + e.amount, 0);

  const catMap = new Map<string, number>();
  for (const e of expenses) catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.amount);
  const byCategory = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount: round(amount), pct: total ? Math.round((amount / total) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const zoneMap = new Map<string, number>();
  for (const e of expenses) zoneMap.set(e.zone, (zoneMap.get(e.zone) ?? 0) + e.amount);
  const byZone = [...zoneMap.entries()].map(([zone, amount]) => ({ zone, amount: round(amount) })).sort((a, b) => b.amount - a.amount);

  const monthMap = new Map<string, number>();
  for (const e of expenses) monthMap.set(monthKey(e.date), (monthMap.get(e.date.slice(0, 7)) ?? 0) + e.amount);
  const monthly = [...monthMap.entries()].map(([month, amount]) => ({ month, amount: round(amount) })).sort((a, b) => (a.month < b.month ? -1 : 1));

  return { total: round(total), thisMonth: round(thisMonth), byCategory, byZone, monthly };
}

export type BudgetStatus = { pct: number; remaining: number; over: boolean };

export function budgetStatus(spent: number, monthlyBudget: number): BudgetStatus {
  const pct = monthlyBudget > 0 ? Math.round((spent / monthlyBudget) * 100) : 0;
  return { pct, remaining: round(monthlyBudget - spent), over: spent > monthlyBudget };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
