'use strict';

import {mongoose} from '../../database/db';

import type {SeasonalIngredient, SeasonalIngredientDatabase} from '../../../../data/ingredients/types/ingredientTypes';

const {Schema, model} = mongoose;

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december',
] as const;

const SeasonalIngredientSchema = new Schema <SeasonalIngredient> (
  {
    name: { type: String, required: true, trim: true },
    altNames: { type: [String] , default: undefined },
    seasonality: { type: [String], required: true, enum: MONTHS }
  }
);

const SeasonalIngredientDatabaseSchema = new Schema <SeasonalIngredientDatabase> (
  {
    fish: { type: [SeasonalIngredientSchema], default: [] },
    fruit: { type: [SeasonalIngredientSchema], default: [] },
    herbs: { type: [SeasonalIngredientSchema], default: [] },
    meat: { type: [SeasonalIngredientSchema], default: [] },
    nuts: { type: [SeasonalIngredientSchema], default: [] },
    poultry: { type: [SeasonalIngredientSchema], default: [] },
    shellfish: { type: [SeasonalIngredientSchema], default: [] },
    vegetables: { type: [SeasonalIngredientSchema], default: [] }
  },
  {
    collection: 'seasonalIngredients'
  }
);

export const seasonalIngredients = model('seasonalIngredients', SeasonalIngredientDatabaseSchema);

