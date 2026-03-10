import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { userModel } from "../../../models/user-model";
import { createAccessToken } from "../../../utilities/test-utils";

let mongo: MongoMemoryServer;

describe("DELETE /favourite/:recipeId", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.15" }
    });
    await connectDB(mongo.getUri());
  })

  afterAll(async () => {
    await disconnectDB();
    await mongo.stop();
  })

  beforeEach(async () => {
    await userModel.deleteMany({});
  })

  async function expectError(app: any, recipeId: string, errorCode: number, error: string, cookie?: string) {
    const res = cookie
      ? await request(app).delete(`/favourite/${recipeId}`).set("Cookie", cookie)
      : await request(app).delete(`/favourite/${recipeId}`)
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  it("deletes favourite recipe from user profile (204)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(
      app,
      { _id: "irish_pork_1", name: "Irish coddled pork with cider", addedAt: new Date() }
    );

    const res = await request(app).delete("/favourite/irish_pork_1").set("Cookie", accessToken);

    const user = await userModel.findOne({ email: "bob.simmons@email.com" }).lean();

    expect(res.status).toBe(204);
    expect(user?.favouriteRecipes).toEqual([]);
  })

  it("throws an error for an invalid recipe ID (400)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const errorReturned = "No recipe ID. Please provide a valid recipe ID.";

    await expectError(app, "%20%20%20", 400, errorReturned, accessToken);
  })

  it("throws an error for an invalid user ID (404)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(
      app,
      { _id: "irish_pork_1", name: "Irish coddled pork with cider", addedAt: new Date() }
    );

    await userModel.deleteMany({});

    const errorReturned = "User not found. Please provide an ID for a valid user.";

    await expectError(app, "irish_pork_1", 404, errorReturned, accessToken);
  })

  it("throws an error if favourite recipe not found (404)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const errorReturned = "Favourite recipe not found. Please provide an ID for a valid recipe.";

    await expectError(app, "irish_pork_1", 404, errorReturned, accessToken);
  })
})
