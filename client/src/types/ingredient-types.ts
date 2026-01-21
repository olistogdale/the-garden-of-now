import type { StatusT } from './status-types'

export type IngredientsContextValueT = {
  ingredients: string[] | null,
  ingredientsStatus: StatusT,
  ingredientsError: string | null
};