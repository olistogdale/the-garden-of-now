'use strict';

import { recipeModel } from '../../models/recipe-model';
import type { Context } from 'koa';
import type { RecipeT, RecipeResponseT } from '../../../../data/recipes/types/recipe-types';

export const getRecipe = async function (ctx: Context) {
  const { recipeId } = ctx.params;

  if (typeof recipeId !== 'string' || !recipeId.trim()) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid recipe ID. Please provide a valid recipe ID.' };
    return;
  }

  try {
    const recipe = await recipeModel
      .findById(recipeId)
      .lean<RecipeT>();

    if (!recipe) {
      ctx.status = 404;
      ctx.body = { error: `Recipe ${recipeId} not found.` };
      return;
    }

    ctx.status = 200;
    const body: RecipeResponseT = { recipe };
    ctx.body = body;
  } catch (err) {
    console.log(`Error fetching recipe ${recipeId}:`, err);
    ctx.status = 500;
    ctx.body = { error: `Internal server error: could not fetch recipe ${recipeId}.` };
  }
};