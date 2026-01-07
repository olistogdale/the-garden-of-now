'use strict';

import { mongoose } from '../../database/db';

import type { SeasonalIngredientFallback } from '../../../../data/ingredients/types/ingredientTypes';

const { Schema, model } = mongoose;

const SeasonalIngredientFallbackSchema = new Schema <SeasonalIngredientFallback> (
  {
    name: { type: String, required: true, trim: true },
    altNames: [{ type: String , default: undefined }],
    parentIngredients: [{ type: String, required: true }],
    fallbackType: { type: String, required: true }
  },
  {
    _id: true
  }
);

export const seasonalIngredientFallbackModel = model('SeasonalIngredientFallback', SeasonalIngredientFallbackSchema);