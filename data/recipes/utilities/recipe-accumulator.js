'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let recipesTotal = [];

for (let i = 2008; i < 2026; i++) {
  for (let j = 1; j < 5; j++) {
    try {
      const inputPath = path.join(__dirname, `../seed-data/raw-data/missing-raw-seed-data-${i}-Q${j}.json`);
      const rawData = fs.readFileSync(inputPath, 'utf8');
      const recipes = JSON.parse(rawData);
      recipesTotal = recipesTotal.concat(recipes);
    } catch {
      continue;
    }
  }
}

const outputPath = path.join(__dirname, '../seed-data/raw-data/missing-raw-seed-data-total.json')

fs.writeFileSync(outputPath, JSON.stringify(recipesTotal, null, 2), 'utf8');
console.log(`Recipes accumulated. This library contains ${recipesTotal.length} recipes.`)
