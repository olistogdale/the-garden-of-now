'use strict';

import { userModel } from '../../models/user-model';
import { recipeModel } from '../../models/recipe-model';
import { isNonEmpty, normalize } from '../../utilities/string-utils';
import { isInSeason } from '../../utilities/seasonality-utils';

import type {Context} from 'koa';
import type { FavouriteCardT, FavouritesRequestT, FavouritesResponseT, RecipeEntryT } from '../../../../data/users/types/user-types';
import type { RecipeCardT, RecipesResponseT } from '../../../../data/recipes/types/recipe-types';

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 96;

export const getFavourites = async function (ctx: Context) {
  const userId = ctx.state.user.userId;
  const { ingredients } = ctx.request.body as FavouritesRequestT;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid ingredients. Please specify a non empty array of ingredients strings.'};
    return;
  }

  const pageRaw: string | undefined = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page;
  const limitRaw: string | undefined = Array.isArray(ctx.query.limit) ? ctx.query.limit[0] : ctx.query.limit;

  const page: number = Math.max(1, Number(pageRaw ?? 1) || 1);
  const limit: number = Math.min(MAX_LIMIT, Math.max(1, Number(limitRaw ?? DEFAULT_LIMIT) || DEFAULT_LIMIT));
  const skip: number = (page - 1) * limit;

  const normalizedIngredients = new Set(
    ingredients
      .filter(Boolean)
      .map(normalize)
      .filter(isNonEmpty)
  );

  try {
    const user = await userModel
      .findById<{ _id: string; favouriteRecipes: RecipeEntryT[] }>(userId, { favouriteRecipes: 1 })
      .lean()
      .exec();

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'User not found. Please provide an ID for a valid user.'};
      return;
    }

    const favouriteEntries = Array.isArray(user.favouriteRecipes) ? user.favouriteRecipes : [];

    if (favouriteEntries.length === 0) {
      ctx.status = 200;
      ctx.body = {
        recipes: [],
        totalCount: 0,
        totalPages: 0,
      } as RecipesResponseT;
      return;
    }

    const favouriteIds = favouriteEntries
      .slice()
      .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())
      .map((favourite) => favourite._id);

    const totalCount = favouriteIds.length;
    const totalPages = Math.ceil(totalCount/limit);
    const pageRecipeIds = favouriteIds.slice(skip, skip + limit);
  
    const favouriteRecipes = await recipeModel
      .find<RecipeCardT>({ _id: { $in: pageRecipeIds } })
      .select({
        name: 1,
        image: 1,
        prepTime: 1,
        cookTime: 1,
        totalTime: 1,
        skillLevel: 1,
        groupedIngredients: 1
      })
      .lean()
      .exec();

    const favouriteRecipeMap = new Map<string, RecipeCardT>(favouriteRecipes.map((recipe) => [recipe._id, recipe]));
    
    const recipesOrdered = pageRecipeIds
      .map((id) => favouriteRecipeMap
      .get(id)).filter((recipe): recipe is RecipeCardT => recipe !== undefined);

    const recipes: FavouriteCardT[] = recipesOrdered.map((recipe) => {
      return isInSeason(recipe, normalizedIngredients) ?
        { ...recipe, inSeason: true } :
        { ...recipe, inSeason: false }
    })

    ctx.status = 200;
    const body: FavouritesResponseT = { recipes, totalCount, totalPages};
    ctx.body = body;
  } catch (err) {
    console.log('Error fetching favourite recipes:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error: could not fetch favourite recipes.'}
  }
};
