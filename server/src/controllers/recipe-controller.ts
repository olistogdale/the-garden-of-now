'use strict';

import {recipeModel} from '../models/recipe-model';
import {isNonEmpty, normalize} from '../utilities/string-utils';

import type {Context} from 'koa';
import type {RecipeCard} from '../../../data/recipes/types/recipeTypes'
import type { AvailableIngredientPayload } from '../../../data/ingredients/types/ingredientTypes';

const getAvailableRecipes = async function (ctx: Context) {
  const {availableIngredients, seed} = ctx.request.body as AvailableIngredientPayload;

  if (!Array.isArray(availableIngredients) || availableIngredients.length === 0) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid ingredients. Please specify a non empty array of ingredient strings.'};
    return;
  }

  if (typeof seed !== 'string' || seed.trim().length === 0 || seed.length > 128) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid seed. Please specify a non empty seed string shorter than 128 characters.'};
    return;
  }

  const normalizedIngredients = [...new Set(
    availableIngredients
      .filter(Boolean)
      .map(normalize)
      .filter(isNonEmpty)
  )];

  const normalizedSeed = normalize(seed);

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
                  in: { $in: ["$$candidate", normalizedIngredients] }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    $addFields: {
      sortKey: {
        $function: {
          lang: "js",
          args: [normalizedSeed, { $toString: "$_id" }],
          body: function (seed: string, id: string) {
            let hash = 2166136261;
            const str = seed + ":" + id;
            for (let i = 0; i < str.length; i++) {
              hash ^= str.charCodeAt(i);
              hash = (hash * 16777619) >>> 0;
            }
            return hash;
          }
        }
      }
    }
  },
  { $sort: { sortKey: 1, _id: 1 } },
  {
    $project: {
      name: 1,
      image: 1,
      prepTime: 1,
      cookTime: 1,
      totalTime: 1,
      skillLevel: 1,
      _id: { $toString: "$_id" },
      sortKey: 0
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