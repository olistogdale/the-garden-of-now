import { describe, it, expect, vi } from "vitest";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

vi.mock("../config", () => {
  return {
    config: {
      jwtSecret: "correct-jwt-secret",
      jwtExpiration: "1h"
    }
  }
})

import { signAccessToken, verifyAccessToken } from "./jwt-utils";

import type { JwtPayload } from 'jsonwebtoken';

describe("signAccessToken", () => {
  it("returns a valid token when called with a user ID", () => {
    const token = signAccessToken("user-1000");

    const payload = jwt.verify(token, "correct-jwt-secret") as JwtPayload;

    expect(payload.sub).toBe("user-1000");
  })

  it("throws an error when called with an empty ID", () => {
    expect(() => signAccessToken("   ")).toThrow("Invalid user ID.")
  })
})

describe("verifyAccessToken", () => {
  it("returns a correct payload when called with valid token and secret key", () => {
    const token = jwt.sign({ sub: "user-1000" }, "correct-jwt-secret", { expiresIn: "1h"});

    const payload: JwtPayload = verifyAccessToken(token);

    expect(payload.sub).toBe("user-1000");
  })

  it("throws an error when called with an invalid token", () => {
    expect(() => verifyAccessToken("incorrect-token")).toThrow(JsonWebTokenError);
  })

  it("throws an error when called with an empty token", () => {
    expect(() => verifyAccessToken("   ")).toThrow("Invalid token.")
  })

  it("throws an error when called with an expired token", () => {
    const token = jwt.sign({ sub: "user-1000" }, "correct-jwt-secret", { expiresIn: "0s" });

    expect(() => verifyAccessToken(token)).toThrow(TokenExpiredError);
  })
})