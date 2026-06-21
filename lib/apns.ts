/**
 * Apple Push Notification service (APNs) helper for Live Activity updates.
 *
 * Sends `ContentState` updates to in-progress Live Activities using token-based
 * (p8) authentication over HTTP/2. Pure builders are separated from the network
 * call so they can be unit-tested without credentials.
 *
 * Configure via environment (all required to actually send):
 *   APNS_KEY_ID, APNS_TEAM_ID, APNS_AUTH_KEY (the .p8 contents), APNS_BUNDLE_ID,
 *   APNS_HOST (defaults to the production host).
 */
import crypto from "crypto";
import http2 from "http2";

export interface ApnsConfig {
  keyId: string;
  teamId: string;
  authKey: string; // PEM contents of the .p8 file
  bundleId: string;
  host: string;
}

export function apnsConfig(): ApnsConfig | null {
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  const authKey = process.env.APNS_AUTH_KEY;
  const bundleId = process.env.APNS_BUNDLE_ID;
  if (!keyId || !teamId || !authKey || !bundleId) return null;
  return {
    keyId,
    teamId,
    authKey,
    bundleId,
    host: process.env.APNS_HOST || "https://api.push.apple.com",
  };
}

export function isApnsConfigured(): boolean {
  return apnsConfig() !== null;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Build the ES256-signed APNs provider JWT. Apple accepts the token for up to an
 * hour; callers should cache and refresh rather than minting per request.
 */
export function buildApnsJWT(config: Pick<ApnsConfig, "keyId" | "teamId" | "authKey">, now: number = Math.floor(Date.now() / 1000)): string {
  const header = base64url(JSON.stringify({ alg: "ES256", kid: config.keyId, typ: "JWT" }));
  const claims = base64url(JSON.stringify({ iss: config.teamId, iat: now }));
  const signingInput = `${header}.${claims}`;
  const signature = crypto
    .createSign("SHA256")
    .update(signingInput)
    .sign({ key: config.authKey, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${base64url(signature)}`;
}

export interface LiveActivityState {
  status: string;
  progress: number;
  etaMinutes?: number | null;
}

/**
 * Build the APNs payload for a Live Activity `update` or `end` event.
 * `staleDate` / `dismissalDate` are unix seconds.
 */
export function buildLiveActivityPayload(
  state: LiveActivityState,
  options: { event?: "update" | "end"; staleDate?: number; dismissalDate?: number; timestamp?: number } = {}
): Record<string, unknown> {
  const event = options.event ?? "update";
  const aps: Record<string, unknown> = {
    timestamp: options.timestamp ?? Math.floor(Date.now() / 1000),
    event,
    "content-state": {
      status: state.status,
      progress: state.progress,
      etaMinutes: state.etaMinutes ?? null,
    },
  };
  if (options.staleDate) aps["stale-date"] = options.staleDate;
  if (event === "end" && options.dismissalDate) aps["dismissal-date"] = options.dismissalDate;
  return { aps };
}

export interface ApnsResult {
  status: number;
  reason?: string;
}

/**
 * Send a Live Activity push to a single push token over HTTP/2.
 * Returns the APNs HTTP status (200 = accepted).
 */
export function sendLiveActivityPush(
  config: ApnsConfig,
  pushToken: string,
  payload: Record<string, unknown>,
  jwt: string = buildApnsJWT(config)
): Promise<ApnsResult> {
  return new Promise((resolve, reject) => {
    const client = http2.connect(config.host);
    client.on("error", reject);

    const req = client.request({
      ":method": "POST",
      ":path": `/3/device/${pushToken}`,
      authorization: `bearer ${jwt}`,
      "apns-topic": `${config.bundleId}.push-type.liveactivity`,
      "apns-push-type": "liveactivity",
      "apns-priority": "10",
      "content-type": "application/json",
    });

    let status = 0;
    let body = "";
    req.on("response", (headers) => {
      status = Number(headers[":status"]) || 0;
    });
    req.setEncoding("utf8");
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      client.close();
      let reason: string | undefined;
      if (body) {
        try { reason = (JSON.parse(body) as { reason?: string }).reason; } catch { /* non-JSON */ }
      }
      resolve({ status, reason });
    });
    req.on("error", (err) => {
      client.close();
      reject(err);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}
