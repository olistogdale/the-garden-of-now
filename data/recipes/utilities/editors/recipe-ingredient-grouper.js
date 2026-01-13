'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isExpressionWithTypeArguments } from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../../data/clean-data/clean-seed-data-total-yield-ingredients-edited-nullified-deduped.json')

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

let count = 0;

const recipesWithGroupedIngredients = recipes.map((recipe) => {
  const groupedIngredients = [];
  for (let ingredient of recipe.ingredients) {
    if (ingredient.optional === false) {
      const options = ingredient.ingredientOptions.flatMap((option) => {
        return option.rawIngredients
      })

      const exists = groupedIngredients.some(arr =>
        arr.length === options.length && arr.every((v, i) => v === options[i])
      );

      if (!exists) {
        groupedIngredients.push(options);
      }
    } else {
      continue;
    }
  }
  recipe = {
     ...recipe,
     groupedIngredients 
   }
  return recipe;
});

const outputPath = path.join(__dirname, '../../data/clean-data/clean-seed-data-total-yield-ingredients-edited-nullified-deduped-grouped.json');

fs.writeFileSync(outputPath, JSON.stringify(recipesWithGroupedIngredients, null, 2), 'utf8')




