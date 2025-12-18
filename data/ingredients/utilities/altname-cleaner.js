/*
This algorithm runs through the ingredients files and removes empty 'altnames' properties when they're unnecessary.
*/

'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/clean-data/non-seasonal-ingredients.json');

const rawData = fs.readFileSync(inputPath, 'utf8');
const nonSeasonalIngredients = JSON.parse(rawData);

for (let foodGroup of Object.keys(nonSeasonalIngredients)) {
  for (let ingredient of nonSeasonalIngredients[foodGroup]) {
    if (Array.isArray(ingredient.altname) && ingredient.altname.length === 0) {
      delete ingredient.altname;
    }
  }
}

const outputPath = path.join(__dirname, '../seed-data/clean-data/non-seasonal-ingredients-cleaned.json');

fs.writeFileSync(outputPath, JSON.stringify(nonSeasonalIngredients, null, 2), 'utf8');

console.log('File cleaned')