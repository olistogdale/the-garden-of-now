import { API_URL } from '../config';

import { fetchRequest } from '../utilities/fetch-request';
import { month } from '../utilities/generate-month';

import type { IngredientsResponseT } from '../../../data/ingredients/types/ingredient-types';

export async function getIngredients(
  signal?: AbortSignal,
): Promise<IngredientsResponseT> {
  const url = `${API_URL}/ingredients/${month}`;
  return fetchRequest(url, {
    method: 'GET',
    signal,
  });
}
