import bcrypt from "bcryptjs";
import request from "supertest"

import { userModel } from "../models/user-model";

import type { RecipeT } from "../../../data/recipes/types/recipe-types";
import { RecipeEntryT } from "../../../data/users/types/user-types";

export function makeRecipe(overrides: Partial<RecipeT> = {}) {
  return {
    _id: "recipe-" + Math.random().toString(16).slice(2),
    name: "name",
    description: "description",
    image: [
      { url: "https://imgurl.com/img.jpg", width: 1, height: 1 }
    ],
    url: "https://url.com",
    ingredients: [
      {
        text: "ingredient",
        optional: false,
        ingredientOptions: [
          {
            ingredient: "ingredient",
            rawIngredients: ["ingredient"],
          },
        ],
      },
    ],
    instructions: [{ text: "instruction" }],
    groupedIngredients: [
      ["ingredient", "other ingredient"],
      ["ingredient"]
    ],
    ...overrides,
  };
}

export function convertToObject(token: string) {
  return Object.fromEntries(token.split("; ").map((string: string) => {
    return string.split("=");
  }))
}

export function extractAccessToken(res: any) {
  const rawSetCookie = res.headers["set-cookie"] ?? [];
  const setCookie = Array.isArray(rawSetCookie)
    ? rawSetCookie
    : rawSetCookie
      ? [rawSetCookie]
      : [];
  return setCookie.filter((cookie) => cookie.startsWith("accessToken="))[0];
}

export async function createAccessToken(app: any, ...favourites: RecipeEntryT[]) {
  const hashedPassword = await bcrypt.hash("TheGardenOfNow", 10);

  await userModel.create({
    name: {
      first: "Bob",
      last: "Simmons"
    },
    email: "bob.simmons@email.com",
    emailVerified: true,
    passwordHash: hashedPassword,
    favouriteRecipes: favourites,
    role: "user",
    lastLoginAt: new Date()
  });

  const loginRes = await request(app).post("/login").send({
    email: "bob.simmons@email.com",
    password: "TheGardenOfNow"
  });

  return extractAccessToken(loginRes);
}
