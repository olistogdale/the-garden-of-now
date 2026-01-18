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

const month = MONTHS[new Date().getMonth()]
const url = `http://127.0.0.1:3000/ingredients/${month}`;

export async function fetchAvailableIngredients(): Promise<AvailableIngredientsResponseT> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`)
    };
    const body = await res.json();
    return body;
  } catch (err) {
    console.log('Error fetching ingredients', err);
    throw err;
  }
}