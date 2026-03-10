import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { createApp } from "../../../app";
import { connectDB, disconnectDB } from "../../../database/db";
import { recipeModel } from "../../../models/recipe-model";
import { makeRecipe } from "../../../utilities/test-utils";

let mongo: MongoMemoryServer;

describe("GET /recipes/:id", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: "6.0.15" }
    })
    await connectDB(mongo.getUri());
  })

  afterAll(async () => {
    await disconnectDB();
    mongo && await mongo.stop();
  })

  beforeEach(async () => {
    await recipeModel.deleteMany({})
  })

  async function expectError(app: any, query: any, errorCode: number, error: string) {
    const res = await request(app).get(`/recipes/${query}`);
    expect(res.status).toBe(errorCode);
    error && expect(res.body).toMatchObject({ error });
  }

  it("returns a full recipe entry for a given specified ID", async () => {
    let recipeArray = [];
    let i = 0

    while (i < 30) {
      recipeArray.push(makeRecipe({ _id: "id" + i, name: "name" + i, groupedIngredients: [["ingredient"]]}));
      i++;
    }

    const returnedRecipe = {
      _id: "gnocchi_squash_2",
      name: "Gnocchi with roasted squash & goat’s cheese",
      image: [
        {
          url: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-9163_12-6d73646.jpg?resize=440,400",
          width: 440,
          height: 400
        }
      ],
      cookTime: "PT20M",
      totalTime: "PT35M",
      skillLevel: "Easy",
      groupedIngredients: [
        ["butternut squash"],
        ["garlic clove"],
        ["olive oil"],
        ["gnocchi"],
        ["spinach"],
        ["goat's cheese"]
      ]
    }

    recipeArray.push(makeRecipe(returnedRecipe));

    await recipeModel.create(recipeArray);

    const app = createApp().callback();

    const res = await request(app).get("/recipes/gnocchi_squash_2");

    expect(res.status).toBe(200);
    expect(res.body.recipe).toMatchObject(returnedRecipe);
  })

  it("throws an error for invalid input (400)", async () => {
    const app = createApp().callback();

    const errorReturned = "Invalid recipe ID. Please provide a valid recipe ID."

    await expectError(app, "%20%20%20", 400, errorReturned);
  })

  it("throws an error for incorrect recipe ID (404)", async () => {
    const app = createApp().callback();
    
    const errorReturned = "Recipe irish_pork_1 not found."

    await expectError(app, "irish_pork_1", 404, errorReturned);
  })
})