'use strict';

import {seasonalIngredientModel} from '../models/ingredients/seasonal-ingredient-model';
import {nonSeasonalIngredientModel} from '../models/ingredients/non-seasonal-ingredient-model';

import type {Context} from 'koa';
import type {
  SeasonalIngredient,
  NonSeasonalIngredient
} from '../../../data/ingredients/types/ingredientTypes';

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

const normalize =  function(string: string) {
  return string.trim().toLowerCase();
}

const nameAggregator = function (array: (SeasonalIngredient | NonSeasonalIngredient)[]) {
  return array
    .flatMap((el: SeasonalIngredient | NonSeasonalIngredient) => el.altNames ? [el.name, ...el.altNames] : [el.name])
    .map(normalize)
    .filter(s => s.length > 0);
};

const getIngredients = async function (ctx: Context) {
  const month = normalize(ctx.params.month ?? '');

  if (!MONTHS.has(month)) {
    ctx.status =  400;
    ctx.body = { error: 'Invalid month. Please specify a correct month.' };
    return;
  }

  try {
    const [seasonalIngredientsRetrieval, nonSeasonalIngredientsRetrieval] = await Promise.all(
      [
        seasonalIngredientModel
          .find({seasonality: month})
          .select({ name: 1, altNames: 1, _id: 0 })
          .lean(),
        nonSeasonalIngredientModel
          .find()
          .select({ name: 1, altNames: 1, _id: 0 })
          .lean()
      ]
    );

    const seasonalIngredients = nameAggregator(seasonalIngredientsRetrieval);
    const nonSeasonalIngredients = nameAggregator(nonSeasonalIngredientsRetrieval);
    const availableIngredients = Array.from(new Set([...seasonalIngredients, ...nonSeasonalIngredients]));
    
    ctx.status = 200;
    ctx.body = { month, availableIngredients, count: availableIngredients.length };
  } catch (err) {
    console.log('Error connecting to server: ' + err)
    ctx.status = 500;
    ctx.body = { error: 'Internal server error.' };
  }
};

export {getIngredients};