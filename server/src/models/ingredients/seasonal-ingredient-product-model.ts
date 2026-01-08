'use strict';

import { mongoose } from '../../database/db';

import type { SeasonalIngredientProduct } from '../../../../data/ingredients/types/ingredientTypes';

const { Schema, model } = mongoose;

const FOOD_GROUPS = [
  'fish',
  'meat',
  'poultry',
  'shellfish'
] as const;

const SeasonalIngredientProductSchema = new Schema <SeasonalIngredientProduct> (
  {
    name: { 
      type: String,
      required: true,
      trim: true
    },
    parentIngredient: {
      type: String,
      required: true
    },
    foodGroup: {
      type: String,
      enum: FOOD_GROUPS,
      required: true
    },
    altNames: {
      type: [String],
      default: undefined
    }
  }
);

export const seasonalIngredientProductModel = model('SeasonalIngredientProduct', SeasonalIngredientProductSchema);