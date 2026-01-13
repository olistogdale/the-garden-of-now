'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../../data/clean-data/clean-seed-data-total-yield-ingredients-edited-nullified-deduped.json')

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

let count = 0;

for (let recipe of recipes) {
  count ++;
}

console.log(count)