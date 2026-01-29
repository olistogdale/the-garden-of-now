'use strict';

import { recipeModel } from '../../models/recipe-model';
import type { Context } from 'koa';
import type { RecipeT, RecipeByIDResponseT } from '../../../../data/recipes/types/recipe-types';

export const getRecipe = async function (ctx: Context) {
  const recipeID = String(ctx.params.id ?? '').trim();

  if (recipeID.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid recipe ID.' };
    return;
  }

  try {
    const recipe = await recipeModel
      .findById(recipeID)
      .lean<RecipeT>()
      .exec();

    if (!recipe) {
      ctx.status = 404;
      ctx.body = { error: `Recipe ${recipeID} not found.` };
      return;
    }

    ctx.status = 200;
    ctx.body = { recipe } as RecipeByIDResponseT;
  } catch (err) {
    console.log(`Error fetching recipe ${recipeID}:`, err);
    ctx.status = 500;
    ctx.body = { error: `Internal server error: could not fetch recipe ${recipeID}.` };
  }
};