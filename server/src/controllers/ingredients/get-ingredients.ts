'use strict';

import { seasonalIngredientModel } from '../../models/seasonal-ingredient-model';
import { nonSeasonalIngredientModel } from '../../models/non-seasonal-ingredient-model';
import { normalize } from '../../utilities/string-utils';
import { nameAggregator } from '../../utilities/name-aggregator';

import type { Context } from 'koa';
import type { IngredientsResponseT, GenericIngredientT } from '../../../../data/ingredients/types/ingredient-types';

const MONTHS = new Set([
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
]);

export const getIngredients = async function (ctx: Context) {
  const { month } = ctx.params;

  if (typeof month !== 'string' || !month.trim()) {
    ctx.status =  400;
    ctx.body = { error: 'Invalid month. Please specify a correct month.' };
    return;
  }

  const normalizedMonth = normalize(month)

  if (!MONTHS.has(normalizedMonth)) {
    ctx.status =  400;
    ctx.body = { error: 'Invalid month. Please specify a correct month.' };
    return;
  }

  try {
    const [seasonalIngredientsRetrieval, nonSeasonalIngredientsRetrieval] = await Promise.all(
      [
        seasonalIngredientModel
          .find({ seasonality: normalizedMonth })
          .select({ name: 1, altNames: 1, _id: 0 })
          .lean<GenericIngredientT[]>(),
        nonSeasonalIngredientModel
          .find()
          .select({ name: 1, altNames: 1, _id: 0 })
          .lean<GenericIngredientT[]>()
      ]
    );

    const seasonalIngredients = nameAggregator(seasonalIngredientsRetrieval);
    const nonSeasonalIngredients = nameAggregator(nonSeasonalIngredientsRetrieval);
    const ingredients: string[] = Array.from(new Set([...seasonalIngredients, ...nonSeasonalIngredients]));
    
    ctx.status = 200;
    const body: IngredientsResponseT = {
      ingredients
    }
    ctx.body = body;
  } catch (err) {
    console.log('Error fetching ingredients:', err)
    ctx.status = 500;
    ctx.body = { error: 'Internal server error: could not fetch ingredients.' };
  }
};