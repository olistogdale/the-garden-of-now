'use strict';

import type {Context} from 'koa';

export const getFavouriteRecipes = async function (ctx: Context) {

};



// 'use strict';

// import {userModel} from '../../models/user-model';
// import {recipeModel} from '../../models/recipe-model';
// import {isNonEmpty, normalize} from '../../utilities/string-utils';

// import type {Context} from 'koa';
// import type {RecipeCard, FacetRecipeResult} from '../../../../data/recipes/types/recipe-types'
// import type {AvailableIngredientPayload} from '../../../../data/ingredients/types/ingredient-types';

// const DEFAULT_LIMIT = 25;
// const MAX_LIMIT = 100;

// export const getFavouriteRecipes = async function (ctx: Context) {
//   const {availableIngredients, userID} = ctx.request.body as AvailableIngredientPayload;

//   if (!Array.isArray(availableIngredients) || availableIngredients.length === 0) {
//     ctx.status = 400;
//     ctx.body = {error: 'Invalid ingredients. Please specify a non empty array of ingredient strings.'};
//     return;
//   }

//   const pageRaw: string | undefined = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page;
//   const limitRaw: string | undefined = Array.isArray(ctx.query.limit) ? ctx.query.limit[0] : ctx.query.limit;

//   const page: number = Math.max(1, Number(pageRaw ?? 1) || 1);
//   const limit: number = Math.min(MAX_LIMIT, Math.max(1, Number(limitRaw ?? DEFAULT_LIMIT) || DEFAULT_LIMIT));
//   const skip: number = (page - 1) * limit;

//   const normalizedIngredients = [...new Set(
//     availableIngredients
//       .filter(Boolean)
//       .map(normalize)
//       .filter(isNonEmpty)
//   )];

//   try {
//     const userRecipeIDs = await userModel.find()

//     const pageRecipes: RecipeCard[] = data?.results ?? [];
//     const pageCount: number = pageRecipes.length;
//     const totalCount: number = data?.totalCount?.[0]?.count ?? 0;
//     const totalPages: number = Math.ceil(totalCount/limit);

//     ctx.status = 200;
//     ctx.body = {
//       pageRecipes,
//       pageCount,
//       page,
//       limit,
//       totalCount,
//       totalPages
//     }
//   } catch (err) {
//     console.log('Error fetching favourite recipes:', err);
//     ctx.status = 500;
//     ctx.body = {error: 'Internal server error: could not fetch favourite recipes.'};
//   }
// };