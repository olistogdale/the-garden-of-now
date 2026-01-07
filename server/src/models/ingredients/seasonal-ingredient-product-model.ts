'use strict';

import { mongoose } from '../../database/db';

import type { SeasonalIngredientProduct, SeasonalIngredientProductCollection } from '../../../../data/ingredients/types/ingredientTypes';

const { Schema, model } = mongoose;

const CATALOGUE_ID = "seasonal-ingredient-product-catalogue";

const SeasonalIngredientProductSchema = new Schema <SeasonalIngredientProduct> (
  {
    name: { type: String, required: true, trim: true },
    altNames: [{ type: String , default: undefined }],
    parentIngredient: { type: String, required: true }
  },
  {
    _id: true
  }
);

const SeasonalIngredientProductCollectionSchema = new Schema <SeasonalIngredientProductCollection> (
  {
    _id: { type: String, default: CATALOGUE_ID},
    fish: { type: [SeasonalIngredientProductSchema], default: [] },
    meat: { type: [SeasonalIngredientProductSchema], default: [] },
    poultry: { type: [SeasonalIngredientProductSchema], default: [] },
    shellfish: { type: [SeasonalIngredientProductSchema], default: [] }
  }
);

export const seasonalIngredientProductModel = model('SeasonalIngredientProduct', SeasonalIngredientProductCollectionSchema);