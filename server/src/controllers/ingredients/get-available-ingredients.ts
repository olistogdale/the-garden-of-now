'use strict';

import { seasonalIngredientModel } from '../../models/seasonal-ingredient-model';
import { nonSeasonalIngredientModel } from '../../models/non-seasonal-ingredient-model';
import { isNonEmpty, normalize } from '../../utilities/string-utils';

import type { Context } from 'koa';
import type {
  IngredientRetrievalT
} from '../../../../data/ingredients/types/ingredient-types';

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

const nameAggregator = function (array: IngredientRetrievalT[]) {
  return array
    .flatMap((el) => el.altNames ? [el.name, ...el.altNames] : [el.name])
    .map(normalize)
    .filter(isNonEmpty);
};

export const getAvailableIngredients = async function (ctx: Context) {
  const month: string = normalize(ctx.params.month ?? '');

  if (!MONTHS.has(month)) {
    ctx.status =  400;
    ctx.body = { error: 'Invalid month. Please specify a correct month.' };
    return;
  }

  try {
    const [seasonalIngredientsRetrieval, nonSeasonalIngredientsRetrieval] = await Promise.all(
      [
        seasonalIngredientModel
          .find({ seasonality: month })
          .select({ name: 1, altNames: 1, _id: 0 })
          .lean <IngredientRetrievalT[]> (),
        nonSeasonalIngredientModel
          .find()
          .select({ name: 1, altNames: 1, _id: 0 })
          .lean <IngredientRetrievalT[]> ()
      ]
    );

    const seasonalIngredients = nameAggregator(seasonalIngredientsRetrieval);
    const nonSeasonalIngredients = nameAggregator(nonSeasonalIngredientsRetrieval);
    const availableIngredients: string[] = Array.from(new Set([...seasonalIngredients, ...nonSeasonalIngredients]));
    
    ctx.status = 200;
    ctx.body = { month, availableIngredients, count: availableIngredients.length };
  } catch (err) {
    console.log('Error fetching ingredients:', err)
    ctx.status = 500;
    ctx.body = { error: 'Internal server error: could not fetch available ingredients.' };
  }
};