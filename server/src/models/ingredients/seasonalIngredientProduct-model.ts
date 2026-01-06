'use strict';

import {mongoose} from '../../database/db';

import type {SeasonalIngredientProduct, SeasonalIngredientProductCollection} from '../../../../data/ingredients/types/ingredientTypes';

const {Schema, model} = mongoose;

const SeasonalIngredientProductSchema = new Schema <SeasonalIngredientProduct> (
  {
    name: { type: String, required: true, trim: true },
    altNames: { type: [String] , default: undefined },
    parentIngredient: { type: String, required: true }
  }
);

const SeasonalIngredientProductCollectionSchema = new Schema <SeasonalIngredientProductCollection> (
  {
    fish: { type: [SeasonalIngredientProductSchema], default: [] },
    meat: { type: [SeasonalIngredientProductSchema], default: [] },
    poultry: { type: [SeasonalIngredientProductSchema], default: [] },
    shellfish: { type: [SeasonalIngredientProductSchema], default: [] }
  }
);

export const seasonalIngredientProductModel = model('SeasonalIngredientProduct', SeasonalIngredientProductCollectionSchema);