'use strict';

import { MongoClient } from 'mongodb';

const recipes = require('../../data/recipes/data/clean-data/recipes.json');
const seasonalIngredients = require('../../data/ingredients/data/clean-data/seasonal-ingredients.json');
const seasonalIngredientProducts = require('../../data/ingredients/data/clean-data/seasonal-ingredient-products-flat.json');
const seasonalIngredientFallbacks = require('../../data/ingredients/data/clean-data/seasonal-ingredient-fallbacks.json');
const nonSeasonalIngredients = require('../../data/ingredients/data/clean-data/non-seasonal-ingredients.json');

async function seedDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('the_garden_of_now');

  await db.collection('recipes').deleteMany({});
  await db.collection('recipes').insertMany(recipes);

  await db.collection('seasonalIngredients').deleteMany({});
  await db.collection('seasonalIngredients').insertOne(seasonalIngredients);

  await db.collection('seasonalIngredientProducts').deleteMany({});
  await db.collection('seasonalIngredientProducts').insertOne(seasonalIngredientProducts);

  await db.collection('seasonalIngredientFallbacks').deleteMany({});
  await db.collection('seasonalIngredientFallbacks').insertMany(seasonalIngredientFallbacks);

  await db.collection('nonSeasonalIngredients').deleteMany({});
  await db.collection('nonSeasonalIngredients').insertOne(nonSeasonalIngredients);

  console.log("Recipes type:", typeof recipes);
  console.log("Is array:", Array.isArray(recipes));
  console.log("Recipes value:", recipes);
  
  console.log('Database seeded successfully');
  client.close();
  process.exit();
}

seedDatabase();