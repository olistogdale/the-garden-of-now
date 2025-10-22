'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../database-seed-data/seedRecipesMaster.json');

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

const recipesShortlist = recipes.map(r => `${r.id}: ${r.title}`);

const flagDuplicates = function (array) {
  const originals = new Set();
  const duplicates = new Set();

  for (let item of array) {
    if (originals.has(item)) {
      duplicates.add(item);
    } else {
      originals.add(item);
    }
  }

  if (Array.from(duplicates).length > 0) {
    return Array.from(duplicates);
  } else {
    return 'No duplicates found';
  }
}

console.log(recipesShortlist);
console.log(flagDuplicates(recipesShortlist))