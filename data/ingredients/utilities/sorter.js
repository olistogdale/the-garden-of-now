'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import seasonalIngredientProductsNested from '../data/clean-data/seasonal-ingredient-products-nested.json' with { type: 'json' };

const seasonalIngredientProductsFlat = {};

for (let property of Object.keys(seasonalIngredientProductsNested)) {
  seasonalIngredientProductsFlat[property] = []
  const foodGroup = seasonalIngredientProductsNested[property];
  for (let prop of Object.keys(foodGroup)) {
    const ingredient = foodGroup[prop];
    for (let product of ingredient) {
      if (product.altNames) {
        seasonalIngredientProductsFlat[property].push({
          name: product.name,
          altNames: product.altNames,
          parentIngredient: prop
        })
      } else {
        seasonalIngredientProductsFlat[property].push({
          name: product.name,
          parentIngredient: prop
        })
      }
      
    }
  }
}

console.log(seasonalIngredientProductsFlat)

const outputPath = path.join(__dirname, '../data/clean-data/seasonal-ingredient-products-flat.json')

fs.writeFileSync(outputPath, JSON.stringify(seasonalIngredientProductsFlat, null, 2), 'utf8');