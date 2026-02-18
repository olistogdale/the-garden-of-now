import type { IngredientDataT } from "../../../data/recipes/types/recipe-types";

export function parseIngredients(ingredientData: IngredientDataT[]): string[] {
  return ingredientData.map((ingredient) => {
    return ingredient.text;
  });
}