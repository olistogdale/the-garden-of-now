'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPathRaw = path.join(__dirname, '../seed-data/clean-data/incomplete-entries-2.json');
const rawData = fs.readFileSync(inputPathRaw, 'utf8');
const recipesRaw = JSON.parse(rawData);

const inputPathClean = path.join(__dirname, '../seed-data/clean-data/incomplete-entries.json');
const cleanData = fs.readFileSync(inputPathClean, 'utf8');
const recipesClean = JSON.parse(cleanData);

let cleanRecipeNames = new Set(recipesClean.map((recipe) => recipe.name));

let missingRecipes = recipesRaw.filter((recipe) => !cleanRecipeNames.has(recipe.name))

const outputPath = path.join(__dirname, '../seed-data/clean-data/incomplete-entries-3.json')
fs.writeFileSync(outputPath, JSON.stringify([...missingRecipes], null, 2), 'utf8')

console.log(`${missingRecipes.length} missing recipes found.`)