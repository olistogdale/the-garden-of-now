import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { userModel } from "../../../models/user-model";
import { recipeModel } from "../../../models/recipe-model";
import { makeRecipe, createAccessToken } from "../../../utilities/test-utils";

let mongo: MongoMemoryServer;

describe("POST /favourites", () => {
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
    await recipeModel.deleteMany({});
  })

  async function expectError(app: any, body: any, errorCode: number, error: string, cookie?: string) {
    const res = cookie
      ? await request(app).post("/favourites").query({ page: 1, limit: 24 }).send(body).set("Cookie", cookie)
      : await request(app).post("/favourites").query({ page: 1, limit: 24 }).send(body);

    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  const mockLoginInfo = {
    email: "bob.simmons@email.com",
    password: "TheGardenOfNow"
  }

  const ingredients = ["butter","pork","potato","carrot","swede","cabbage","bay leaf","cider","chicken stock","butternut squash","garlic clove","olive oil","gnocchi","spinach"]

  it("returns paginated favourite recipes in saved order with seasonality flag (200)", async () => {
    
    await recipeModel.create(
      makeRecipe({
        "_id": "irish_pork_1",
        "name": "Irish coddled pork with cider",
        "image": [
          {
            "url": "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-9116_11-41d76aa.jpg?resize=440,400",
            "width": 440,
            "height": 400
          }
        ],
        "totalTime": "PT35M",
        "skillLevel": "Easy",
        "groupedIngredients": [
          [
            "butter"
          ],
          [
            "pork"
          ],
          [
            "potato"
          ],
          [
            "carrot"
          ],
          [
            "swede"
          ],
          [
            "cabbage"
          ],
          [
            "bay leaf"
          ],
          [
            "cider"
          ],
          [
            "chicken stock"
          ]
        ]
      }),
      makeRecipe({
        "_id": "gnocchi_squash_2",
        "name": "Gnocchi with roasted squash & goat’s cheese",
        "image": [
          {
            "url": "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-9163_12-6d73646.jpg?resize=440,400",
            "width": 440,
            "height": 400
          }
        ],
        "cookTime": "PT20M",
        "totalTime": "PT35M",
        "skillLevel": "Easy",
        "groupedIngredients": [
          [
            "butternut squash"
          ],
          [
            "garlic clove"
          ],
          [
            "olive oil"
          ],
          [
            "gnocchi"
          ],
          [
            "spinach"
          ],
          [
            "goat's cheese"
          ]
        ]
      })
    )

    const app = createApp().callback();

    const accessToken = await createAccessToken(
      app,
      { _id: "irish_pork_1", name: "Irish coddled pork with cider", addedAt: new Date() },
      { _id: "gnocchi_squash_2", name: "Gnocchi with roasted squash & goat’s cheese", addedAt: new Date() }
    );

    const res = await request(app).post("/favourites").query({ page: 1, limit: 24 }).send({ ingredients: ingredients }).set("Cookie", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.totalPages).toBe(1);
    expect(Array.isArray(res.body.recipes)).toBe(true);
    expect(res.body.recipes).toHaveLength(2);
    expect(res.body.recipes[0]._id).toBe("irish_pork_1");
    expect(res.body.recipes[0].name).toBe("Irish coddled pork with cider");
    expect(res.body.recipes[0].inSeason).toBe(true);
    expect(res.body.recipes[1].inSeason).toBe(false);
  })

  it("returns empty response if user has no saved favourites (200)", async () => {
    const app = createApp().callback();
    
    const accessToken = await createAccessToken(app);

    const res = await request(app).post("/favourites").send({ ingredients: ingredients }).set("Cookie", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.recipes).toEqual([]);
    expect(res.body.totalCount).toBe(0);
    expect(res.body.totalPages).toBe(0);
  })

  it("throws an error for invalid ingredients input (400)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const errorReturned = "Invalid ingredients. Please specify a non empty array of ingredients strings.";

    await expectError(app, { ingredients: 1 }, 400, errorReturned, accessToken);
    await expectError(app, { ingredients: [] }, 400, errorReturned, accessToken);
  })

  it("throws an error for an invalid user ID (401)", async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    await userModel.deleteMany({});

    const errorReturned = "User not found. Please provide an ID for a valid user.";

    await expectError(app, { ingredients: ingredients }, 401, errorReturned, accessToken);
  })

  it("throws an error if user provides bad token (401)", async () => {
    const app = createApp().callback();

    const errorReturned = "Invalid or expired token. Please provide a valid access token.";

    await expectError(app, { ingredients: ingredients }, 401, errorReturned, "accessToken=bad-token");
  })

  it("throws an error if user fails to provide a token (401)", async () => {
    const app = createApp().callback();

    const errorReturned = "Not authenticated. Please provide a valid access token.";

    await expectError(app, { ingredients: ingredients }, 401, errorReturned);
  })
})
