import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { userModel } from "../../../models/user-model";
import { extractAccessToken } from "./test-utils";

let mongo: MongoMemoryServer

describe("POST /logout", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.15" }
    });
    await connectDB(mongo.getUri());
  })

  afterAll(async () => {
    await disconnectDB();
    mongo && await mongo.stop();
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  async function expectError(app: any, errorCode: number, error: string, cookie?: any) {
    const res = cookie
      ? await request(app).post("/logout").set("Cookie", cookie)
      : await request(app).post("/logout") 
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  function convertToObject(token: string) {
    return Object.fromEntries(token.split("; ").map((string: string) => {
      return string.split("=");
    }))
  }

  const mockLoginInfo = {
    email: "bob.simmons@email.com",
    password: "TheGardenOfNow"
  }

  it("sets status to success and removes valid access token from cookies (204)", async () => {
    const hashedPassword = await bcrypt.hash("TheGardenOfNow", 10)
            
    await userModel.create({
      name: {
        first: "Bob",
        last: "Simmons"
      },
      email: "bob.simmons@email.com",
      emailVerified: true,
      passwordHash: hashedPassword,
      favouriteRecipes: [],
      role: "user",
      lastLoginAt: new Date()
    })
    
    const app = createApp().callback();

    const loginRes = await request(app).post("/login").send(mockLoginInfo);

    const accessToken = extractAccessToken(loginRes);
    const accessTokenObj = convertToObject(accessToken);

    const res = await request(app).post("/logout").set("Cookie", accessToken);

    const clearedAccessToken = extractAccessToken(res);
    const clearedAccessTokenObj = convertToObject(clearedAccessToken);

    expect(accessToken).toBeTruthy();
    expect(accessTokenObj.accessToken).toBeTruthy();
    expect(res.status).toBe(204);
    expect(clearedAccessTokenObj.accessToken).toBeFalsy();
    expect(new Date(clearedAccessTokenObj.expires).getTime()).toBeLessThan(new Date().getTime());
  })

  it("throws an error if user provides bad token (401)", async () => {
    const app = createApp().callback();

    const errorReturned = "Invalid or expired token. Please provide a valid access token."
    
    await expectError(app, 401, errorReturned, "accessToken=bad-token");
  })

  it("throws an error if user fails to provide a token (401)", async () => {
    const app = createApp().callback();

    const errorReturned = "Not authenticated. Please provide a valid access token."

    await expectError(app, 401, errorReturned);
  })
})