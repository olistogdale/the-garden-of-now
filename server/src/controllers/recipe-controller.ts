'use strict';

import {recipeModel} from '../models/recipe-model';
import {isNonEmpty, normalize} from '../utilities/string-utils';

import type {Context} from 'koa';
import type {RecipeCard} from '../../../data/recipes/types/recipeTypes'
import type { AvailableIngredientPayload } from '../../../data/ingredients/types/ingredientTypes';

const getAvailableRecipes = async function (ctx: Context) {
  const {availableIngredients} = ctx.request.body as AvailableIngredientPayload;

  if (!Array.isArray(availableIngredients) || availableIngredients.length === 0) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid ingredients. Please specify seasonally available ingredients.'};
    return;
  }

  const allowed = [...new Set(
    availableIngredients
      .filter(Boolean)
      .map(normalize)
      .filter(isNonEmpty)
  )];


  try {
    const availableRecipes = await recipeModel.aggregate<RecipeCard>([
      {
        $match: {
          $expr: {
            $allElementsTrue: {
              $map: {
                input: "$groupedIngredients",
                as: "group",
                in: {
                  $anyElementTrue: {
                    $map: {
                      input: "$$group",
                      as: "candidate",
                      in: { $in: ["$$candidate", allowed] }
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          image: 1,
          prepTime: 1,
          cookTime: 1,
          totalTime: 1,
          skillLevel: 1,
          _id: { $toString: "$_id" },
        }
      }
    ]);

    ctx.status = 200;
    ctx.body = {availableRecipes, count: availableRecipes.length}
  } catch (err) {
    console.log('Error fetching available recipes:', err);
    ctx.status = 500;
    ctx.body = {error: 'Internal server error: could not fetch available recipes.'};
  }
};

export {getAvailableRecipes};