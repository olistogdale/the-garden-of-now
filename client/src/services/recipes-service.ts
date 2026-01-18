import { API_URL } from '../config.ts';

import { fetchRequest } from '../utilities/fetch-request.ts';

export async function fetchSeasonalRecipes(availableIngredients: string[], seed: string) {
  const url = `${API_URL}/recipes`;

  return fetchRequest(url, {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ availableIngredients, seed })
  })
}

export async function fetchRecipeByID(id: string) {
  const url = `${API_URL}/recipes/${id}`;

  return fetchRequest(url, {
    method: 'GET'
  })
}

// export async function fetchSeasonalRecipes(availableIngredients: string[], seed: string[]) {
//   const url = `${API_URL}/recipes`;

//   try {
//     const res = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ availableIngredients, seed })
//     })

//     if (!res.ok) {
//       throw new Error(`Response status: ${res.status}`)
//     }

//     const body = await res.json();
//     return body;
//   } catch (err) {
//     console.log(`Error fetching recipes`, err);
//     throw err;
//   }
// }

// export async function fetchRecipeByID(id: string) {
//   const url = `${API_URL}/recipes/${id}`;

//   try {
//     const res = await fetch(url, {
//       method: 'GET'
//     })

//     if (!res.ok) {
//       throw new Error(`Response status: ${res.status}`)
//     }

//     const body = await res.json();
//     return body;
//   } catch (err) {
//     console.log(`Error fetching recipe ${id}`, err);
//     throw err;
//   }
// }