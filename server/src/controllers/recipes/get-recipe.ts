'use strict';

import { recipeModel } from '../../models/recipe-model';
import type { Context } from 'koa';
import type { RecipeT, RecipeResponseT } from '../../../../data/recipes/types/recipe-types';

export const getRecipe = async function (ctx: Context) {
  const { id } = ctx.params;

  if (typeof id !== 'string' || !id.trim()) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid recipe ID. Please provide a valid recipe ID.' };
    return;
  }

  try {
    const recipe = await recipeModel
      .findById(id)
      .lean<RecipeT>();

    if (!recipe) {
      ctx.status = 404;
      ctx.body = { error: `Recipe ${id} not found.` };
      return;
    }

    ctx.status = 200;
    const body: RecipeResponseT = { recipe };
    ctx.body = body;
  } catch (err) {
    console.log(`Error fetching recipe ${id}:`, err);
    ctx.status = 500;
    ctx.body = { error: `Internal server error: could not fetch recipe ${id}.` };
  }
};