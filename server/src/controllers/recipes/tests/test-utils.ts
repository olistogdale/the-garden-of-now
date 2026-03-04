import type { RecipeT } from "../../../../../data/recipes/types/recipe-types";

export function makeRecipe(overrides: Partial<RecipeT> = {}) {
  return {
    _id: "recipe-" + Math.random().toString(16).slice(2),
    name: "name",
    description: "description",
    image: [
      { url: "https://imgurl.com/img.jpg", width: 1, height: 1 }
    ],
    url: "https://url.com",
    ingredients: [
      {
        text: "ingredient",
        optional: false,
        ingredientOptions: [
          {
            ingredient: "ingredient",
            rawIngredients: ["ingredient"],
          },
        ],
      },
    ],
    instructions: [{ text: "instruction" }],
    groupedIngredients: [
      ["ingredient", "other ingredient"],
      ["ingredient"]
    ],
    ...overrides,
  };
}