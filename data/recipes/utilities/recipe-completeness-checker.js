'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/clean-data/missing-clean-seed-data-total.json')

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

const recipeTemplate = [
  'name',
  'description',
  'image',
  'url',
  'keywords',
  'prepTime',
  'cookTime',
  'totalTime',
  'recipeYield',
  'nutrition',
  'recipeCategory',
  'recipeIngredients',
  'recipeInstructions',
  'cuisine',
  'skillLevel'
]

let incompleteEntries = new Set();
let completeEntries = new Set();

for (let recipe of recipes) {
  let missing = [];
  for (let prop of recipeTemplate) {
    if (!Object.hasOwn(recipe, prop)) {
      missing.push(prop)
    }
  }
  if (missing.length > 0) {
    incompleteEntries.add(recipe);
    console.log(`${recipe.name} is missing the following entries: ${missing}`)
  } else {
    completeEntries.add(recipe);
  }
};

// const outputPathIncomplete = path.join(__dirname, '../seed-data/raw-data/missing-recipes-incomplete-entries.json');
// fs.writeFileSync(outputPathIncomplete, JSON.stringify([...incompleteEntries], null, 2), 'utf8');

// const outputPathComplete = path.join(__dirname, '../seed-data/raw-data/missing-recipes-complete-entries.json');
// fs.writeFileSync(outputPathComplete, JSON.stringify([...completeEntries], null, 2), 'utf8');

console.log(`${incompleteEntries.size} recipes out of ${recipes.length} are incomplete`)