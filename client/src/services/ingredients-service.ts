import { API_URL } from '../config.ts';

import { fetchRequest } from '../utilities/fetch-request.ts';

export type AvailableIngredientsResponseT = {
  month: string,
  availableIngredients: string[]
};

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];


export async function fetchAvailableIngredients(): Promise <AvailableIngredientsResponseT> {
  const month = MONTHS[new Date().getMonth()];
  const url = `${API_URL}/ingredients/${month}`;
  return fetchRequest(url, {
      method: "GET"
  })
}


// export async function fetchAvailableIngredients(): Promise<AvailableIngredientsResponseT> {
//   const month = MONTHS[new Date().getMonth()]
//   const url = `${API_URL}/ingredients/${month}`;
  
//   try {
//     const res = await fetch(url, {
//       method: "GET"
//     });

//     if (!res.ok) {
//       throw new Error(`Response status: ${res.status}`)
//     };

//     const body = await res.json();
//     return body;
//   } catch (err) {
//     console.log('Error fetching ingredients', err);
//     throw err;
//   }
// }