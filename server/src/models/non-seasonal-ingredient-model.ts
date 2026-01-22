'use strict';

import { mongoose } from '../database/db';

import type { NonSeasonalIngredientT } from '../../../data/ingredients/types/ingredient-types';

const { Schema, model } = mongoose;

const FOOD_GROUPS = [
  'cured meat',
  'cured fish',
  'cheese',
  'oil',
  'vinegar',
  'condiments',
  'herbs and spices',
  'stocks and gravies',
  'canned vegetables',
  'noodles',
  'nuts',
  'grains',
  'pulses',
  'bread',
  'biscuits',
  'crisps',
  'dairy',
  'eggs',
  'baking',
  'spreads',
  'tea and coffee',
  'confectionery',
  'alcohol',
  'juice',
  'water'
] as const;

const NonSeasonalIngredientSchema = new Schema <NonSeasonalIngredientT> (
  {
    name: {
      type: String,
      required: true,
      trim: true
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

export const nonSeasonalIngredientModel = model('NonSeasonalIngredient', NonSeasonalIngredientSchema);