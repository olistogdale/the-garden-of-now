/*
This algorithm runs through the seed-recipes-master JSON file and returns a list containing all ingredients from within this file.
*/

'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/seed-recipes-master.json');

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

const extractIngredients = function (array) {
  const totalList = [];

  for (let recipe of array) {
    for (let ingredientObj of recipe.extendedIngredients) {
      totalList.push(ingredientObj.nameClean);
    }
  }

  return totalList;
}

const ingredientsSorted = extractIngredients(recipes).toSorted();

ingredientsSorted.forEach(el => console.log(el));
console.log(`Total unique ingredients: ${ingredientsSorted.length}`);