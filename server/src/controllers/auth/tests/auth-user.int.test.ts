import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { userModel } from "../../../models/user-model";
import { extractAccessToken } from "./test-utils";

let mongo: MongoMemoryServer;

describe("GET /auth/me", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.15"}
    });
    await connectDB(mongo.getUri());
  })

  afterAll(async () => {
    await disconnectDB();
    mongo && await mongo.stop();
  })

  beforeEach(async () => {
    await userModel.deleteMany({});
  })

  async function expectError(app: any, errorCode: number, error: string, cookie?: any) {
    const res = cookie
      ? await request(app).get("/auth/me").set("Cookie", cookie)
      : await request(app).get("/auth/me") 
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  const mockLoginInfo = {
    email: "bob.simmons@email.com",
    password: "TheGardenOfNow"
  }

  it("returns user details upon valid user token provision (200)", async () => {
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

    const res = await request(app).get("/auth/me").set("Cookie", accessToken);

    expect(res.status).toBe(200);
    expect(typeof res.body.userId).toBe("string");
    expect(res.body.email).toBe("bob.simmons@email.com");
    expect(res.body.firstName).toBe("Bob");
    expect(res.body.lastName).toBe("Simmons");
    expect(Array.isArray(res.body.favourites)).toBe(true);
  })

  it("throws an error if user not found (404)", async () => {
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

    await userModel.deleteMany({});

    const errorReturned = "User not found (session invalid)."

    await expectError(app, 404, errorReturned, accessToken);
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

