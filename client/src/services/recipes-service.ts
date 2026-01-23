import { API_URL } from '../config.ts';

import { fetchRequest } from '../utilities/fetch-request.ts';

import type { RecipesRequestT, RecipesResponseT, RecipeByIDResponseT } from '../../../data/recipes/types/recipe-types.ts'

export async function fetchRecipes(
  { ingredients, seed }: RecipesRequestT,
  page: number = 1,
  limit: number = 25,
  signal?: AbortSignal
): Promise <RecipesResponseT> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })
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

export async function fetchRecipeByID(id: string, signal?: AbortSignal): Promise <RecipeByIDResponseT> {
  const url = `${API_URL}/recipes/${id}`;

  return fetchRequest(url, {
    method: 'GET',
    signal
  })
}