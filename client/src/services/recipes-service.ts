import { API_URL } from '../config.ts';

import { fetchRequest } from '../utilities/fetch-request.ts';

import type { RecipesRequestT, RecipesResponseT, RecipeResponseT } from '../../../data/recipes/types/recipe-types.ts'

export function getRecipes(
  { ingredients, seed }: RecipesRequestT,
  page: number = 1,
  limit: number = 24,
  signal?: AbortSignal
): Promise <RecipesResponseT> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });
  const url = `${API_URL}/recipes?${params.toString()}`;

  return fetchRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ingredients, seed }),
    signal
  })
}

export function getRecipeByID(recipeId: string, signal?: AbortSignal): Promise <RecipeResponseT> {
  const url = `${API_URL}/recipes/${recipeId}`;

  return fetchRequest(url, {
    method: 'GET',
    signal
  })
}