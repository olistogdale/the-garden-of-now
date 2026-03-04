import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { userModel } from "../../../models/user-model";

let mongo: MongoMemoryServer;

describe("POST /register", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.15" }
    })
    await connectDB(mongo.getUri())
  })

  afterAll(async () => {
    await disconnectDB();
    mongo && await mongo.stop();
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  async function expectError(app: any, body: any, errorCode: number, error: string) {
    const res = await request(app).post(`/register`).send(body);
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  const mockUserInfo = {
    firstName: "Bob",
    lastName: "Simmons",
    email: "bob.simmons@email.com",
    password: "TheGardenOfNow"
  }

  it("sets an access token in cookies and returns user details upon valid user registration input (201)", async () => {
    const app = createApp().callback();

    const res = await request(app).post("/register").send(mockUserInfo);

    const rawSetCookie = res.headers["set-cookie"] ?? [];
    const setCookie = Array.isArray(rawSetCookie)
      ? rawSetCookie
      : rawSetCookie
        ? [rawSetCookie]
        : [];
    const accessCookie = setCookie.filter((cookie) => cookie.startsWith("accessToken="))[0];

    const newUser = await userModel.findOne({ email: mockUserInfo.email.toLowerCase() }).lean();

    expect(res.status).toBe(201);
    expect(typeof res.body.userId).toBe("string");
    expect(res.body.firstName).toBe("Bob");
    expect(res.body.lastName).toBe("Simmons");
    expect(res.body.email).toBe("bob.simmons@email.com");

    expect(accessCookie).toBeTruthy();
    expect(/HttpOnly/i.test(accessCookie)).toBe(true);
  
    expect(newUser).not.toBeNull();
    expect(newUser!.passwordHash).toBeDefined();
    expect(newUser!.passwordHash).not.toBe(mockUserInfo.password);
    await expect(bcrypt.compare(mockUserInfo.password, newUser!.passwordHash)).resolves.toBe(true);
  })
  
  it("throws an error for invalid user name or email input (400)", async () => {
    const app = createApp().callback();

    const errorReturned = "Invalid registration credentials. Please provide a first name, last name and email."

    await expectError(app, { ...mockUserInfo, firstName: "   " }, 400, errorReturned);
    await expectError(app, { ...mockUserInfo, firstName: 1 }, 400, errorReturned);
    await expectError(app, { ...mockUserInfo, lastName: "   " }, 400, errorReturned);
    await expectError(app, { ...mockUserInfo, lastName: 1 }, 400, errorReturned);
    await expectError(app, { ...mockUserInfo, email: "   " }, 400, errorReturned);
    await expectError(app, { ...mockUserInfo, email: 1 }, 400, errorReturned);
  })

  it("throws an error for invalid password input (400)", async () => {
    const app = createApp().callback();

    const errorReturned = "Invalid password. Passwords must be at least 8 characters in length."

    await expectError(app, { ...mockUserInfo, password: 1 }, 400, errorReturned);
    await expectError(app, { ...mockUserInfo, password: "short" }, 400, errorReturned);
  })

  it("throws an error for email input that matches an existing user (409)", async () => {
    await userModel.create({
      name: {
        first: "Bob",
        last: "Simmons"
      },
      email: "bob.simmons@email.com",
      emailVerified: true,
      passwordHash: "passwordhash",
      favouriteRecipes: [],
      role: "user",
      lastLoginAt: new Date()
    })
    
    const app = createApp().callback();

    const errorReturned = "A user already exists with this e-mail address. Please provide a different address."

    await expectError(app, { ...mockUserInfo }, 409, errorReturned);
  })
})
