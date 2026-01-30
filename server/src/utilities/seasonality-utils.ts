import type { RecipeCardT } from "../../../data/recipes/types/recipe-types"

export function isInSeason(recipe: RecipeCardT, ingredientsSet: Set<string>) {
  return recipe.groupedIngredients.every((ingredientOptions) => {
    return ingredientOptions.some((ingredient) => ingredientsSet.has(ingredient))
  })
}