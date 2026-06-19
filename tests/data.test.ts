import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Data-access layer tests (lib/data/*). These repositories are the only place the
 * app talks to Postgres, so we assert each one targets the right table, applies
 * the correct RLS-scoping filters / ordering, and surfaces errors — using a
 * chainable fake of the Supabase client rather than a live database.
 */

// ── Chainable Supabase query fake ─────────────────────────────────────────────
type Result = { data: unknown; error: { message: string } | null };

function makeQuery(result: Result) {
  const calls: Record<string, unknown[][]> = {};
  const record = (name: string, args: unknown[]) => {
    (calls[name] ??= []).push(args);
  };
  // Every builder method returns the same thenable so chains of any length work;
  // terminal methods (single/maybeSingle) and awaiting the builder both resolve
  // to `result`.
  const builder: Record<string, (...a: unknown[]) => unknown> = {};
  for (const m of ["select", "insert", "update", "delete", "eq", "is", "order", "limit"]) {
    builder[m] = (...args: unknown[]) => {
      record(m, args);
      return builder;
    };
  }
  builder.single = (...args: unknown[]) => {
    record("single", args);
    return Promise.resolve(result);
  };
  builder.maybeSingle = (...args: unknown[]) => {
    record("maybeSingle", args);
    return Promise.resolve(result);
  };
  // Awaiting the builder directly (list queries) resolves to the result.
  (builder as unknown as PromiseLike<Result>).then = (onFulfilled: (r: Result) => unknown) =>
    Promise.resolve(result).then(onFulfilled);
  return { builder, calls };
}

const fromMock = vi.fn();
const getUserMock = vi.fn();

vi.mock("../lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock, auth: { getUser: getUserMock } })),
  createServiceClient: vi.fn(async () => ({ from: fromMock, auth: { getUser: getUserMock } })),
}));

import {
  appendEnergyReading,
  listEnergyReadings,
} from "../lib/data/energy";
import { listDevices, listNotifications, listSchedules } from "../lib/data/smarthome";
import { setSessionTrust } from "../lib/data/profile";

beforeEach(() => {
  fromMock.mockReset();
  getUserMock.mockReset();
});

describe("energy data layer", () => {
  it("appendEnergyReading inserts into energy_readings and returns the row", async () => {
    const row = { id: "r1", property_id: "p1", solar: 5, home: 1, vehicle: 0, battery: 2, grid: -2, battery_pct: 90, car_pct: 70, recorded_at: "now" };
    const { builder, calls } = makeQuery({ data: row, error: null });
    fromMock.mockReturnValue(builder);

    const out = await appendEnergyReading({ property_id: "p1", solar: 5, home: 1, vehicle: 0, battery: 2, grid: -2, battery_pct: 90 });

    expect(fromMock).toHaveBeenCalledWith("energy_readings");
    expect(calls.insert?.[0][0]).toMatchObject({ property_id: "p1", solar: 5 });
    expect(calls.single).toBeDefined();
    expect(out).toEqual(row);
  });

  it("listEnergyReadings scopes by property, orders newest-first and limits", async () => {
    const { builder, calls } = makeQuery({ data: [], error: null });
    fromMock.mockReturnValue(builder);

    await listEnergyReadings("p1", 48);

    expect(fromMock).toHaveBeenCalledWith("energy_readings");
    expect(calls.eq?.[0]).toEqual(["property_id", "p1"]);
    expect(calls.order?.[0]).toEqual(["recorded_at", { ascending: false }]);
    expect(calls.limit?.[0]).toEqual([48]);
  });

  it("listEnergyReadings throws on a Postgres error", async () => {
    const { builder } = makeQuery({ data: null, error: { message: "boom" } });
    fromMock.mockReturnValue(builder);
    await expect(listEnergyReadings("p1")).rejects.toThrow("boom");
  });
});

describe("smart-home data layer", () => {
  it("listNotifications filters out archived rows", async () => {
    const { builder, calls } = makeQuery({ data: [], error: null });
    fromMock.mockReturnValue(builder);

    await listNotifications("p1");

    expect(fromMock).toHaveBeenCalledWith("notifications");
    // property scope + is_archived=false are both applied
    expect(calls.eq).toEqual(expect.arrayContaining([["property_id", "p1"], ["is_archived", false]]));
  });

  it("listDevices orders by last_seen_at desc", async () => {
    const { builder, calls } = makeQuery({ data: [], error: null });
    fromMock.mockReturnValue(builder);
    await listDevices("p1");
    expect(fromMock).toHaveBeenCalledWith("device_registry");
    expect(calls.order?.[0]).toEqual(["last_seen_at", { ascending: false }]);
  });

  it("listSchedules orders by at_time ascending", async () => {
    const { builder, calls } = makeQuery({ data: [], error: null });
    fromMock.mockReturnValue(builder);
    await listSchedules("p1");
    expect(fromMock).toHaveBeenCalledWith("automation_schedules");
    expect(calls.order?.[0]).toEqual(["at_time", { ascending: true }]);
  });
});

describe("profile data layer", () => {
  it("setSessionTrust updates is_trusted scoped to the owner", async () => {
    const { builder, calls } = makeQuery({ data: null, error: null });
    fromMock.mockReturnValue(builder);

    await setSessionTrust("u1", "s1", true);

    expect(fromMock).toHaveBeenCalledWith("user_sessions");
    expect(calls.update?.[0][0]).toEqual({ is_trusted: true });
    expect(calls.eq).toEqual(expect.arrayContaining([["id", "s1"], ["user_id", "u1"]]));
  });
});
