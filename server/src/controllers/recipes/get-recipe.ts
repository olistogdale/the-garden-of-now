'use strict';

import mongoose from 'mongoose';
import { recipeModel } from '../../models/recipe-model';

import type { Context } from 'koa';
import type { RecipeT, RecipeByIDResponseT } from '../../../../data/recipes/types/recipe-types';

export const getRecipe = async function(ctx: Context) {
  const recipeID: string = String(ctx.params.id ?? '').trim()

  if (recipeID.length === 0) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid recipe ID. Please specify a non empty ID string.'};
    return;
  }

  if (!mongoose.isValidObjectId(recipeID)) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid recipe ID. Please specify a valid ID format.'};
    return;
  }

  try {
    const [recipe] = await recipeModel.aggregate <RecipeT> ([
      { $match: { _id: new mongoose.Types.ObjectId(recipeID) } },
      {
        $project: {
          _id: { $toString: '$_id' },
          name: 1,
          description: 1,
          image: 1,
          url: 1,
          keywords: 1,
          prepTime: 1,
          cookTime: 1,
          totalTime: 1,
          nutrition: 1,
          cuisine: 1,
          skillLevel: 1,
          yield: 1,
          category: 1,
          ingredients: 1,
          instructions: 1,
          groupedIngredients: 1,
        },
      },
    ]).exec();

    if (!recipe) {
      ctx.status = 404;
      ctx.body = { error: `Recipe ${recipeID} not found.` };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      recipe
    } as RecipeByIDResponseT;
  } catch (err) {
    console.log(`Error fetching recipe ${recipeID}:`, err);
    ctx.status = 500;
    ctx.body = { error: `Internal server error: could not fetch recipe ${recipeID}.` };
  }
};