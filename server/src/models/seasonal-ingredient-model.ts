'use strict';

import { mongoose } from '../database/db';

import type { SeasonalIngredientT } from '../../../data/ingredients/types/ingredient-types';

const { Schema, model } = mongoose;

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
] as const;

const FOOD_GROUPS = [
  'fish',
  'fruit',
  'herbs',
  'meat',
  'nuts',
  'poultry',
  'shellfish',
  'vegetables'
] as const;

const SeasonalIngredientSchema = new Schema <SeasonalIngredientT> (
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    seasonality: {
      type: [String],
      enum: MONTHS,
      required: true,
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

export const seasonalIngredientModel = model('SeasonalIngredient', SeasonalIngredientSchema);

