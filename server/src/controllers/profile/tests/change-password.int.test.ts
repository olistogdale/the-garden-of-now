import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { userModel } from "../../../models/user-model";
import { extractAccessToken } from "../../../utilities/test-utils";

let mongo: MongoMemoryServer;

describe("PATCH /password", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.15" }
    });
    await connectDB(mongo.getUri());
  });

  afterAll(async () => {
    await disconnectDB();
    mongo && await mongo.stop();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  async function createAccessToken(app: any) {
    const hashedPassword = await bcrypt.hash("TheGardenOfNow", 10);

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
    });

    const loginRes = await request(app).post("/login").send({
      email: "bob.simmons@email.com",
      password: "TheGardenOfNow"
    });

    return extractAccessToken(loginRes);
  }

  async function expectError(app: any, body: any, errorCode: number, error: string, cookie?: any) {
    const res = cookie
      ? await request(app).patch("/password").send(body).set("Cookie", cookie)
      : await request(app).patch("/password").send(body)

    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  it("changes user password for valid authenticated input (204)", async () => {
    const app = createApp().callback()

    const accessToken = await createAccessToken(app);

    const res = await request(app)
      .patch("/password")
      .set("Cookie", accessToken)
      .send({
        currentPassword: "TheGardenOfNow",
        newPassword: "TheGardenOfThen"
      });

    const updatedUser = await userModel.findOne({ email: "bob.simmons@email.com" });

    expect(res.status).toBe(204);
    expect(updatedUser).toBeTruthy();
    await expect(bcrypt.compare("TheGardenOfNow", updatedUser!.passwordHash)).resolves.toBe(false);
    await expect(bcrypt.compare("TheGardenOfThen", updatedUser!.passwordHash)).resolves.toBe(true);
  });

  it("throws an error for invalid password input (400)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const errorReturned = "Invalid password input. Please provide a valid current password and a new password at least 8 characters in length.";

    await expectError(app, { currentPassword: 1, newPassword: "TheGardenOfThen" }, 400, errorReturned, accessToken);
    await expectError(app, { currentPassword: "", newPassword: "TheGardenOfThen" }, 400, errorReturned, accessToken);
    await expectError(app, { currentPassword: "  TheGardenOfNow " , newPassword: "TheGardenOfThen" }, 400, errorReturned, accessToken);
    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: 1 }, 400, errorReturned, accessToken);
    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: "short" }, 400, errorReturned, accessToken);
    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: "  TheGardenOfThen " }, 400, errorReturned, accessToken);
  });

  it("throws an error for incorrect current password input (401)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const errorReturned = "Invalid password. Please provide a valid current password.";

    await expectError(app, { currentPassword: "WrongPassword", newPassword: "TheGardenOfThen" }, 401, errorReturned, accessToken);
  });

  it("throws an error if new password matches current password (400)", async () => {
    const app = createApp().callback();
    const accessToken = await createAccessToken(app);

    const errorReturned = "Invalid new password. Your new password must be different to your current password.";

    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: "TheGardenOfNow" }, 400, errorReturned, accessToken);
  });

  it("throws an error if user not found (404)", async () => {
    const app = createApp().callback();
    const accessToken = await createAccessToken(app);

    await userModel.deleteMany({});

    const errorReturned = "User not found (session invalid).";

    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: "TheGardenOfThen" }, 404, errorReturned, accessToken);
  });

  it("throws an error if user provides bad token (401)", async () => {
    const app = createApp().callback();

    const errorReturned = "Invalid or expired token. Please provide a valid access token.";

    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: "TheGardenOfThen" }, 401, errorReturned, "accessToken=bad-token");
  });

  it("throws an error if user fails to provide a token (401)", async () => {
    const app = createApp().callback();

    const errorReturned = "Not authenticated. Please provide a valid access token.";

    await expectError(app, { currentPassword: "TheGardenOfNow", newPassword: "TheGardenOfThen" }, 401, errorReturned);
  });
});
