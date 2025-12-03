'use strict'

import fs from 'node:fs';
import path from 'node:path';

import seasonalIngredients from '../seed-data/clean-data/seasonal-ingredients.json'
import seasonalIngredientProducts from '../seed-data/clean-data/seasonal-ingredient-products-nested.json'
import nonSeasonalIngredients from '../seed-data/clean-data/non-seasonal-ingredients.json'

for (let ingredientArray in seasonalIngredients) {
  seasonalIngredients[ingredientArray].sort((a, b) => a.name.localeCompare(b.name))
}

console.log(seasonalIngredients)

const outputPath = path.join(__dirname, './ingredients-sorted.json')

fs.writeFileSync(outputPath, JSON.stringify(seasonalIngredients, null, 2), 'utf8');