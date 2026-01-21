import type { RecipeCardT } from '../../../data/recipes/types/recipe-types'

export type RecipesFacetResultT = {
  results: RecipeCardT[];
  totalCount: { count: number }[];
};