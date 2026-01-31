import { API_URL } from "../config";

import { fetchRequest } from "../utilities/fetch-request";

import type { FavouritesRequestT, FavouriteRequestT, FavouritesResponseT, FavouriteResponseT } from "../../../data/users/types/user-types";

export function getFavourites(
  { ingredients }: FavouritesRequestT,
  page: number = 1,
  limit: number = 24,
  signal?: AbortSignal
): Promise <FavouritesResponseT> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })
  const url = `${API_URL}/favourites?${params.toString()}`

  return fetchRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients }),
    signal
  })
}

export function postFavourite(
  { recipeId, recipeName }: FavouriteRequestT,
  signal?: AbortSignal
): Promise<FavouriteResponseT> {
  const url = `${API_URL}/favourite`

  return fetchRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({recipeId, recipeName}),
    signal
  })
}

export function deleteFavourite( recipeId: string, signal?: AbortSignal
): Promise<void> {
  const url = `${API_URL}/favourite/${recipeId}`;

  return fetchRequest(url, {
    method: "DELETE",
    signal   
  })
}