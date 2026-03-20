'use strict';

import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const recipePath = path.join(__dirname, '../../data/recipes/data/clean-data');
const ingredientPath = path.join(
  __dirname,
  '../../data/ingredients/data/clean-data/flat',
);

const recipes = require(path.join(recipePath, 'recipes.json'));
const seasonalIngredients = require(
  path.join(ingredientPath, 'seasonal-ingredients-flat.json'),
);
const seasonalIngredientProducts = require(
  path.join(ingredientPath, 'seasonal-ingredient-products-flat.json'),
);
const seasonalIngredientFallbacks = require(
  path.join(ingredientPath, 'seasonal-ingredient-fallbacks-flat.json'),
);
const nonSeasonalIngredients = require(
  path.join(ingredientPath, 'non-seasonal-ingredients-flat.json'),
);

function normalizeRecipeUrl(url: string): string {
  const u = new URL(url);
  let pathname = u.pathname.toLowerCase();
  if (pathname.length > 1 && pathname.endsWith('/'))
    pathname = pathname.slice(0, -1);
  return `${u.hostname.toLowerCase()}${pathname}`;
}

function recipeIdFromUrl(url: string): string {
  const hex = crypto
    .createHash('sha256')
    .update(normalizeRecipeUrl(url))
    .digest('hex');

  return `bbc:${hex.slice(0, 24)}`;
}

async function seedDatabase() {
  const mongoUri =
    process.env.MONGO_URI?.trim() ||
    'mongodb://localhost:27017/the_garden_of_now';
  const client = new MongoClient(mongoUri);
  await client.connect();
  const dbNameFromUri = (() => {
    try {
      const { pathname } = new URL(mongoUri);
      return pathname && pathname !== '/'
        ? pathname.slice(1)
        : 'the_garden_of_now';
    } catch {
      return 'the_garden_of_now';
    }
  })();
  const db = client.db(dbNameFromUri);

  const recipesWithIds = recipes.map((r: any) => ({
    ...r,
    _id: recipeIdFromUrl(r.url),
  }));

  await db.collection('recipes').deleteMany({});
  await db.collection('recipes').insertMany(recipesWithIds);

  await db.collection('seasonalingredients').deleteMany({});
  await db.collection('seasonalingredients').insertMany(seasonalIngredients);

  await db.collection('seasonalingredientproducts').deleteMany({});
  await db
    .collection('seasonalingredientproducts')
    .insertMany(seasonalIngredientProducts);

  await db.collection('seasonalingredientfallbacks').deleteMany({});
  await db
    .collection('seasonalingredientfallbacks')
    .insertMany(seasonalIngredientFallbacks);

  await db.collection('nonseasonalingredients').deleteMany({});
  await db
    .collection('nonseasonalingredients')
    .insertMany(nonSeasonalIngredients);

  console.log('Database seeded successfully');
  await client.close();
  process.exit(0);
}

seedDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
