import type { RecipeCardT } from '../../../data/recipes/types/recipe-types';

export function isInSeason(recipe: RecipeCardT, ingredientsSet: Set<string>) {
  if (recipe.groupedIngredients.length === 0) return false;

  return recipe.groupedIngredients.every((ingredientOptions) => {
    return ingredientOptions.some((ingredient) =>
      ingredientsSet.has(ingredient),
    );
  });
}
