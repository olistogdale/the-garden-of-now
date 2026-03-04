import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createApp } from '../../../app'
import { connectDB, disconnectDB } from '../../../database/db';
import { recipeModel } from '../../../models/recipe-model';
import { makeRecipe } from './test-utils';

import type { RecipeT } from '../../../../../data/recipes/types/recipe-types';

let mongo: MongoMemoryServer

describe("POST /recipes", () => {
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
    await recipeModel.deleteMany({});
  })

  const mockSeed = "mockSessionKey"
  const mockIngredients = ["butternut squash", "garlic clove", "olive oil", "gnocchi", "spinach", "goat's cheese"];

  let recipeArray = [];
  let i = 0

  while (i < 30) {
    recipeArray.push(makeRecipe({ _id: "id" + i, name: "name" + i, groupedIngredients: [["ingredient"]]}));
    i++;
  }

  async function expectError(app: any, body: any, errorCode: number, error: string) {
    const res = await request(app).post(`/recipes`).send(body);
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  it("returns partial recipe entries for a given ingredients and seed input (200)", async () => {  
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

    const body = {
      ingredients: mockIngredients,
      seed: mockSeed
    };

    const app = createApp().callback();

    const res = await request(app).post("/recipes").send(body).query({ page: 1, limit: 24});

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      totalCount: 1,
      totalPages: 1
    })
    expect(Array.isArray(res.body.recipes)).toBe(true);
    expect(res.body.recipes).toHaveLength(1);
    expect(res.body.recipes[0]).toMatchObject(returnedRecipe);
  })

  it("returns deterministic entries ordering for a given seed (200)", async () => {
    await recipeModel.create(recipeArray)

    const body1 = {
      ingredients: ["ingredient"],
      seed: mockSeed + "1"
    }

    const body2 = {
      ingredients: ["ingredient"],
      seed: mockSeed + "2"
    }

    const app = createApp().callback();

    const res1a = await request(app).post("/recipes").send(body1).query({ page: 1, limit: 24 });
    const res1b = await request(app).post("/recipes").send(body1).query({ page: 1, limit: 24 });
    const res2 = await request(app).post("/recipes").send(body2).query({ page: 1, limit: 24 });

    const ids1a = res1a.body.recipes.map((recipe: RecipeT) => recipe._id);
    const ids1b = res1b.body.recipes.map((recipe: RecipeT) => recipe._id);
    const ids2 = res2.body.recipes.map((recipe: RecipeT) => recipe._id);

    expect(res1a.status).toBe(200);
    expect(res1b.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(ids1a).toHaveLength(24);
    expect(ids1a).toEqual(ids1b);
    expect(ids1a).not.toEqual(ids2);
  })

  it("returns paginated recipe entries for a given ingredients and seed input (200)", async () => {    
    await recipeModel.create(recipeArray);

    const body = {
      ingredients: ["ingredient"],
      seed: mockSeed
    }

    const app = createApp().callback();

    const res1 = await request(app).post("/recipes").send(body).query({ page: 1, limit: 24 });
    const res2 = await request(app).post("/recipes").send(body).query({ page: 2, limit: 24 });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res1.body).toMatchObject({
      totalCount: 30,
      totalPages: 2
    })
    expect(res2.body).toMatchObject({
      totalCount: 30,
      totalPages: 2
    })
    expect(res1.body.recipes).toHaveLength(24);
    expect(res2.body.recipes).toHaveLength(6);
  });

  it("throws an error for invalid seed input (400)", async () => {
    const app = createApp().callback();

    const seedErrorReturned = "Invalid seed. Please specify a non empty seed string 128 characters or fewer."

    await expectError(app, { ingredients: mockIngredients }, 400, seedErrorReturned);
    await expectError(app, { ingredients: mockIngredients, seed: 1 }, 400, seedErrorReturned);
    await expectError(app, { ingredients: mockIngredients, seed: '   ' }, 400, seedErrorReturned);
    await expectError(app, { ingredients: mockIngredients, seed: "a".repeat(129) }, 400, seedErrorReturned);
  });

  it("throws an error for invalid ingredients input (400)", async () => {
    const app = createApp().callback();

    const ingredientsErrorReturned = "Invalid ingredients. Please specify a non empty array of ingredient strings."

    await expectError(app, { seed: mockSeed }, 400, ingredientsErrorReturned)
    await expectError(app, { ingredients: 1, seed: mockSeed }, 400, ingredientsErrorReturned);
    await expectError(app, { ingredients: [],  seed: mockSeed }, 400, ingredientsErrorReturned);
  })
})