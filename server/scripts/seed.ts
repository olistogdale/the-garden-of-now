'use strict';

import path from 'node:path';

import { MongoClient } from 'mongodb';

const recipePath = path.join(__dirname, '../../data/recipes/data/clean-data')
const ingredientPath = path.join(__dirname, '../../data/ingredients/data/clean-data/flat')

const recipes = require(path.join(recipePath, 'recipes.json'));
const seasonalIngredients = require(path.join(ingredientPath, 'seasonal-ingredients-flat.json'));
const seasonalIngredientProducts = require(path.join(ingredientPath, 'seasonal-ingredient-products-flat.json'));
const seasonalIngredientFallbacks = require(path.join(ingredientPath, 'seasonal-ingredient-fallbacks-flat.json'));
const nonSeasonalIngredients = require(path.join(ingredientPath, 'non-seasonal-ingredients-flat.json'));

async function seedDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('the_garden_of_now');

  await db.collection('recipes').deleteMany({});
  await db.collection('recipes').insertMany(recipes);

  await db.collection('seasonalingredients').deleteMany({});
  await db.collection('seasonalingredients').insertMany(seasonalIngredients);

  await db.collection('seasonalingredientproducts').deleteMany({});
  await db.collection('seasonalingredientproducts').insertMany(seasonalIngredientProducts);

  await db.collection('seasonalingredientfallbacks').deleteMany({});
  await db.collection('seasonalingredientfallbacks').insertMany(seasonalIngredientFallbacks);

  await db.collection('nonseasonalingredients').deleteMany({});
  await db.collection('nonseasonalingredients').insertMany(nonSeasonalIngredients);

  console.log("Recipes type:", typeof recipes);
  console.log("Is array:", Array.isArray(recipes));
  console.log("Recipes value:", recipes);
  
  console.log('Database seeded successfully');
  client.close();
  process.exit();
}

seedDatabase();