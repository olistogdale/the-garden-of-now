/*
This algorithm runs through the seed-recipes-master JSON file, removing any recipes that match the unique recipe IDs entered, and writes the filtered list to a copy of the seed-recipes-master JSON in the same directory
*/

'use strict';

import fs from 'node:fs'
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/seed-recipes-master.json');
const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

const checked = new Set()

const filteredRecipes = recipes.filter((recipe) => {
  if (checked.has(recipe.id)) {
    return false;
  } else {
    checked.add(recipe.id);
    return true;
  }
});

const filteredRecipesJSON = JSON.stringify(filteredRecipes, null, 2);

const outputPath = path.join(__dirname, '../database-seed-data/seed-recipes-master-filtered.json');

fs.writeFileSync(outputPath, filteredRecipesJSON, 'utf8');