import { API_URL } from '../config.ts';

import { fetchRequest } from '../utilities/fetch-request.ts';
import { month } from '../utilities/generate-month.ts'

import type { IngredientsResponsePayloadT } from '../../../data/ingredients/types/ingredient-types.ts'

export async function fetchIngredients(): Promise <IngredientsResponsePayloadT> {
  const url = `${API_URL}/ingredients/${month}`;
  return fetchRequest(url, {
      method: "GET"
    })
}