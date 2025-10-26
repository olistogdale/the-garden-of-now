/*
This algorithm runs through the ingredients-from-proto JSON file and returns a list containing all unique seasonal ingredients from within this file, avoiding any ingredients that are non-seasonal.
For a list that includes non-seasonal ingredients, substitute line 39 with line 40.
*/

'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../seed-data/ingredients-from-proto.json');

const rawData = fs.readFileSync(inputPath, 'utf8');
const ingredients = JSON.parse(rawData);

const extractIngredients = function (array) {
  const totalList = new Set();

  const extractor = function (foodGroup) {
    let list = new Set();

    for (let ingredient of foodGroup) {
      if (list.has(ingredient)) {
        continue;
      } else {
        list.add(ingredient);
      }
    }

    return Array.from(list);
  }

  for (let item of array) {
    if (item.month === "universal") {
      break;
      // const total = extractor(item.ingredients);
    }

    const vegetables = extractor(item.vegetables);
    const fruit = extractor(item.fruit);
    const nutsAndHerbs = extractor(item.nutsAndHerbs);
    const meat = extractor(item.meat);
    const fish = extractor(item.fish);
    const total = [...vegetables, ...fruit, ...nutsAndHerbs, ...meat, ...fish];
    for (let ingredient of total) {
      totalList.add(ingredient)
    }

  }

  return Array.from(totalList);
}

const ingredientsSorted = extractIngredients(ingredients).toSorted();

ingredientsSorted.forEach(el => console.log(el));