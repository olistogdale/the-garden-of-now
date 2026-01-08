/*
Flatten category-grouped ingredient datasets into per-document lists.
Outputs:
  - seasonal-ingredients-flat.json
  - seasonal-ingredient-products-documents.json
  - non-seasonal-ingredients-flat.json
*/

'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanDataDir = path.join(__dirname, '../data/clean-data');

const inputPaths = {
  seasonalIngredients: path.join(cleanDataDir, 'nested/seasonal-ingredients.json'),
  seasonalIngredientProducts: path.join(cleanDataDir, 'nested/seasonal-ingredient-products.json'),
  nonSeasonalIngredients: path.join(cleanDataDir, 'nested/non-seasonal-ingredients.json'),
};

const outputPaths = {
  seasonalIngredients: path.join(cleanDataDir, 'flat/seasonal-ingredients-flat.json'),
  seasonalIngredientProducts: path.join(cleanDataDir, 'flat/seasonal-ingredient-products-flat.json'),
  nonSeasonalIngredients: path.join(cleanDataDir, 'flat/non-seasonal-ingredients-flat.json'),
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const uniq = (items) => Array.from(new Set(items));

const mergeAltNames = (existing, incoming) => {
  const base = Array.isArray(existing) ? existing : [];
  const next = Array.isArray(incoming) ? incoming : [];
  const merged = uniq([...base, ...next]);
  return merged.length ? merged : undefined;
};

const flattenSeasonalIngredients = (dataByCategory) => {
  const byName = new Map();

  for (const category of Object.keys(dataByCategory)) {
    for (const ingredient of dataByCategory[category]) {
      const key = ingredient.name;
      const existing = byName.get(key);

      if (!existing) {
        byName.set(key, {
          name: ingredient.name,
          seasonality: ingredient.seasonality ? [...ingredient.seasonality] : [],
          foodGroup: category,
          altNames: ingredient.altNames ? [...ingredient.altNames] : undefined,
        });
        continue;
      }

      existing.ingredientFamily = uniq([...existing.ingredientFamily, category]);
      existing.seasonality = uniq([
        ...existing.seasonality,
        ...(ingredient.seasonality || []),
      ]);
      existing.altNames = mergeAltNames(existing.altNames, ingredient.altNames);
    }
  }

  return Array.from(byName.values()).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const flattenNonSeasonalIngredients = (dataByCategory) => {
  const byName = new Map();

  for (const category of Object.keys(dataByCategory)) {
    for (const ingredient of dataByCategory[category]) {
      const key = ingredient.name;
      const existing = byName.get(key);

      if (!existing) {
        byName.set(key, {
          name: ingredient.name,
          foodGroup: category,
          altNames: ingredient.altNames ? [...ingredient.altNames] : undefined,
        });
        continue;
      }

      existing.ingredientFamily = uniq([...existing.ingredientFamily, category]);
      existing.altNames = mergeAltNames(existing.altNames, ingredient.altNames);
    }
  }

  return Array.from(byName.values()).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const flattenSeasonalIngredientProducts = (dataByCategory) => {
  const byKey = new Map();

  for (const category of Object.keys(dataByCategory)) {
    for (const product of dataByCategory[category]) {
      const key = `${product.name}__${product.parentIngredient}`;
      const existing = byKey.get(key);

      if (!existing) {
        byKey.set(key, {
          name: product.name,
          parentIngredient: product.parentIngredient,
          foodGroup: category,
          altNames: product.altNames ? [...product.altNames] : undefined,
        });
        continue;
      }

      existing.ingredientFamily = uniq([...existing.ingredientFamily, category]);
      existing.altNames = mergeAltNames(existing.altNames, product.altNames);
    }
  }

  return Array.from(byKey.values()).toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const seasonalIngredients = readJson(inputPaths.seasonalIngredients);
const seasonalIngredientProducts = readJson(inputPaths.seasonalIngredientProducts);
const nonSeasonalIngredients = readJson(inputPaths.nonSeasonalIngredients);

const seasonalIngredientsFlat = flattenSeasonalIngredients(seasonalIngredients);
const seasonalIngredientProductsFlat = flattenSeasonalIngredientProducts(
  seasonalIngredientProducts
);
const nonSeasonalIngredientsFlat = flattenNonSeasonalIngredients(
  nonSeasonalIngredients
);

fs.writeFileSync(
  outputPaths.seasonalIngredients,
  JSON.stringify(seasonalIngredientsFlat, null, 2),
  'utf8'
);
fs.writeFileSync(
  outputPaths.seasonalIngredientProducts,
  JSON.stringify(seasonalIngredientProductsFlat, null, 2),
  'utf8'
);
fs.writeFileSync(
  outputPaths.nonSeasonalIngredients,
  JSON.stringify(nonSeasonalIngredientsFlat, null, 2),
  'utf8'
);

console.log('Wrote:');
console.log(`- ${outputPaths.seasonalIngredients}`);
console.log(`- ${outputPaths.seasonalIngredientProducts}`);
console.log(`- ${outputPaths.nonSeasonalIngredients}`);
