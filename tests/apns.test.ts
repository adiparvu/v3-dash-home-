import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { buildLiveActivityPayload, buildApnsJWT, type LiveActivityState } from "../lib/apns";

describe("buildLiveActivityPayload", () => {
  it("builds an update payload with content-state", () => {
    const payload = buildLiveActivityPayload(
      { status: "In progress", progress: 0.5, etaMinutes: 20 },
      { timestamp: 1000, staleDate: 5000 }
    );
    const aps = (payload as { aps: Record<string, unknown> }).aps;
    expect(aps.event).toBe("update");
    expect(aps.timestamp).toBe(1000);
    expect(aps["stale-date"]).toBe(5000);
    expect(aps["content-state"]).toEqual({ status: "In progress", progress: 0.5, etaMinutes: 20 });
  });

  it("marks end events and defaults a missing ETA to null", () => {
    const state: LiveActivityState = { status: "Completed", progress: 1 };
    const payload = buildLiveActivityPayload(state, { event: "end", dismissalDate: 9000, timestamp: 1 });
    const aps = (payload as { aps: Record<string, unknown> }).aps;
    expect(aps.event).toBe("end");
    expect(aps["dismissal-date"]).toBe(9000);
    expect((aps["content-state"] as { etaMinutes: unknown }).etaMinutes).toBeNull();
  });
});

describe("buildApnsJWT", () => {
  it("produces a verifiable ES256 JWT with the expected header and claims", () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" });
    const pem = privateKey.export({ type: "pkcs8", format: "pem" }) as string;

    const jwt = buildApnsJWT({ keyId: "KEY123", teamId: "TEAM123", authKey: pem }, 1700000000);
    const [h, c, s] = jwt.split(".");

    expect(JSON.parse(Buffer.from(h, "base64url").toString())).toEqual({ alg: "ES256", kid: "KEY123", typ: "JWT" });
    expect(JSON.parse(Buffer.from(c, "base64url").toString())).toEqual({ iss: "TEAM123", iat: 1700000000 });

    const verified = crypto
      .createVerify("SHA256")
      .update(`${h}.${c}`)
      .verify({ key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(s, "base64url"));
    expect(verified).toBe(true);
  });
});
