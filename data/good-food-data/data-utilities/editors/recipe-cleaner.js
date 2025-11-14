'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/raw-data/missing-raw-seed-data-total.json')

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

let updatedRecipes = [];

for (let recipe of recipes) {
  const {forcedURL, ...updatedRecipe} = recipe;
  updatedRecipes.push(updatedRecipe);
}

const outputPathUpdated = path.join(__dirname, '../seed-data/clean-data/missing-clean-seed-data-total.json')
fs.writeFileSync(outputPathUpdated, JSON.stringify([...updatedRecipes], null, 2), 'utf8')