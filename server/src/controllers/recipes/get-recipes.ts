'use strict';

import { recipeModel } from '../../models/recipe-model';
import { isNonEmpty, normalize } from '../../utilities/string-utils';

import type { Context } from 'koa';
import type { RecipeCardT, RecipesRequestT, RecipesResponseT } from '../../../../data/recipes/types/recipe-types';
import type { RecipesFacetResultT } from '../../types/recipe-types';

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 96;

export const getRecipes = async function (ctx: Context) {
  const { ingredients, seed } = ctx.request.body as RecipesRequestT;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid ingredients. Please specify a non empty array of ingredient strings.' };
    return;
  }

  if (typeof seed !== 'string' || seed.trim().length === 0 || seed.length > 128) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid seed. Please specify a non empty seed string shorter than 128 characters.' };
    return;
  }

  const pageRaw: string | undefined = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page;
  const limitRaw: string | undefined = Array.isArray(ctx.query.limit) ? ctx.query.limit[0] : ctx.query.limit;

  const page: number = Math.max(1, Number(pageRaw ?? 1) || 1);
  const limit: number = Math.min(MAX_LIMIT, Math.max(1, Number(limitRaw ?? DEFAULT_LIMIT) || DEFAULT_LIMIT));
  const skip: number = (page - 1) * limit;

  const normalizedIngredients = [...new Set(
    ingredients
      .filter(Boolean)
      .map(normalize)
      .filter(isNonEmpty)
  )];

  const trimmedSeed = seed.trim();

  try {
    const [data] = await recipeModel.aggregate <RecipesFacetResultT> ([
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
              args: [trimmedSeed, "$_id" ],
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
      { $facet: {
          results: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                image: 1,
                prepTime: 1,
                cookTime: 1,
                totalTime: 1,
                skillLevel: 1
              }
            }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);

    const recipes: RecipeCardT[] = data?.results ?? [];
    const totalCount: number = data?.totalCount?.[0]?.count ?? 0;
    const totalPages: number = Math.ceil(totalCount/limit);

    ctx.status = 200;
    ctx.body = {
      recipes,
      totalCount,
      totalPages
    } as RecipesResponseT;
  } catch (err) {
    console.log('Error fetching recipes:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error: could not fetch recipes.' };
  }
};