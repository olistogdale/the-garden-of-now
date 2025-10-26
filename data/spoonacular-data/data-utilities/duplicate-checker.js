/*
This algorithm runs through the seed-recipes-master file and returns a list of each individual recipe in the database, alongside their unique recipe IDs, as well as a list of any recipes that are duplicates, alongside their unique recipe IDs
*/

'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/seed-recipes-master-filtered.json');

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
    return [];
  }
}

const duplicatesShortlist = flagDuplicates(recipesShortlist)

console.log(recipesShortlist);
console.log(`You have ${recipesShortlist.length} recipes in total`)
console.log(duplicatesShortlist)
console.log(`${duplicatesShortlist.length} of these are duplicates`)

