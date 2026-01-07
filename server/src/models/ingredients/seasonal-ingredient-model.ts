'use strict';

import { mongoose } from '../../database/db';

import type { SeasonalIngredient, SeasonalIngredientCollection } from '../../../../data/ingredients/types/ingredientTypes';

const { Schema, model } = mongoose;

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december',
] as const;

const CATALOGUE_ID = "seasonal-ingredient-catalogue";

const SeasonalIngredientSchema = new Schema <SeasonalIngredient> (
  {
    name: { type: String, required: true, trim: true },
    altNames: [{ type: String , default: undefined }],
    seasonality: [{ type: String, required: true, enum: MONTHS }]
  },
  {
    _id: true
  }
);

const SeasonalIngredientCollectionSchema = new Schema <SeasonalIngredientCollection> (
  {
    _id: { type: String, default: CATALOGUE_ID},
    fish: { type: [SeasonalIngredientSchema], default: [] },
    fruit: { type: [SeasonalIngredientSchema], default: [] },
    herbs: { type: [SeasonalIngredientSchema], default: [] },
    meat: { type: [SeasonalIngredientSchema], default: [] },
    nuts: { type: [SeasonalIngredientSchema], default: [] },
    poultry: { type: [SeasonalIngredientSchema], default: [] },
    shellfish: { type: [SeasonalIngredientSchema], default: [] },
    vegetables: { type: [SeasonalIngredientSchema], default: [] }
  }
);

export const seasonalIngredientModel = model('SeasonalIngredient', SeasonalIngredientCollectionSchema);

