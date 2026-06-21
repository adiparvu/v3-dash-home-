import { describe, it, expect } from "vitest";
import { extractBearerToken } from "../lib/supabase/auth-header";

describe("extractBearerToken", () => {
  it("extracts a standard bearer token", () => {
    expect(extractBearerToken("Bearer abc.def.ghi")).toBe("abc.def.ghi");
  });

  it("is case-insensitive on the scheme", () => {
    expect(extractBearerToken("bearer xyz")).toBe("xyz");
    expect(extractBearerToken("BEARER xyz")).toBe("xyz");
  });

  it("tolerates surrounding and extra internal whitespace", () => {
    expect(extractBearerToken("  Bearer   tok  ")).toBe("tok");
  });

  it("returns null for missing or malformed headers", () => {
    expect(extractBearerToken(null)).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
    expect(extractBearerToken("")).toBeNull();
    expect(extractBearerToken("Bearer")).toBeNull();
    expect(extractBearerToken("Bearer    ")).toBeNull();
    expect(extractBearerToken("Basic dXNlcjpwYXNz")).toBeNull();
    expect(extractBearerToken("token abc")).toBeNull();
  });
});
