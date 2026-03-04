import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createApp } from '../../../app';
import { connectDB, disconnectDB } from '../../../database/db';
import { seasonalIngredientModel } from '../../../models/seasonal-ingredient-model';
import { nonSeasonalIngredientModel } from '../../../models/non-seasonal-ingredient-model';

let mongo: MongoMemoryServer;

describe("GET ingredients/:month", () => {
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
    await seasonalIngredientModel.deleteMany({});
    await nonSeasonalIngredientModel.deleteMany({});
  });

  async function expectError(app: any, query: string, errorCode: number, error: string) {
    const res = await request(app).get(`/ingredients/${query}`);
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }
 
  it("returns deduped, normalized available ingredient names for a valid month (200)", async () => {
    await seasonalIngredientModel.create([
      {
        "name": "orange",
        "seasonality": [
          "july",
          "august",
          "september"
        ],
        "foodGroup": "fruit",
        "altNames": [
          "mandarin orange",
          "seville orange"
        ]
      },
      {
        "name": "lemon",
        "seasonality": [
          "january",
          "february",
          "march"
        ],
        "foodGroup": "fruit",
      },
      {
        "name": "tomato",
        "seasonality": [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december"
        ],
        "foodGroup": "vegetables"
      },
      {
        "name": "grapefruit",
        "seasonality": [
          "april",
          "may",
          "june"
        ],
        "foodGroup": "fruit"
      },
      {
        "name": "lime",
        "seasonality": [
          "october",
          "november",
          "december"
        ],
        "foodGroup": "fruit"
      }
    ]);

    await nonSeasonalIngredientModel.create([
      {
        "name": "tomato",
        "foodGroup": "juice"
      },
      {
        "name": "apple chutney",
        "foodGroup": "condiments",
        "altNames": [
          "apple and pear chutney",
          "apple & pear chutney"
        ]
      }
    ]);

    const app = createApp().callback();

    const res = await request(app).get("/ingredients/february");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.ingredients)).toBe(true);
    expect(new Set(res.body.ingredients)).toEqual(new Set(['lemon', 'tomato', 'apple chutney', "apple & pear chutney", "apple and pear chutney"]));
  });

  it("throws an error for invalid input (400)", async () => {
    const app = createApp().callback();
    
    const errorReturned = "Invalid input. Please specify a correct month."
      
    await expectError(app, "%20%20%20", 400, errorReturned);
    await expectError(app, 'easter', 400, errorReturned);
  });
});