'use strict';

export type ImageDataT = {
  url: string,
  width: number,
  height: number,
}

export type NutritionDataT = {
  calories: string,
  fatContent: string,
  saturatedFatContent: string,
  carbohydrateContent: string,
  sugarContent: string,
  fiberContent: string,
  proteinContent: string,
  sodiumContent: string
}

export type IngredientT = {
  quantity: string,
  description: string,
  ingredient: string,
  rawIngredients: string[],
  preparation: string
}

export type IngredientDataT = {
  text: string,
  optional: boolean,
  ingredientOptions?: IngredientT[]
}

export type InstructionT = {
  text: string
}

export type IngredientGroupT = string[]

export type RecipeT = {
  _id: string,
  name: string,
  description: string,
  image: ImageDataT[],
  url: string,
  keywords?: string,
  prepTime?: string,
  cookTime?: string,
  totalTime?: string,
  nutrition?: NutritionDataT,
  cuisine?: string,
  skillLevel?: string,
  yield?: string,
  category?: string,
  ingredients: IngredientDataT[],
  instructions: InstructionT[],
  groupedIngredients: IngredientGroupT[]
}

export type RecipeCardT = {
  _id: string,
  name: string,
  image: ImageDataT[],
  prepTime?: string,
  cookTime?: string,
  totalTime?: string,
  skillLevel?: string
  groupedIngredients: string[][]
}

export type RecipesRequestT = {
  ingredients: string[],
  seed: string
}

export type RecipesResponseT = {
  recipes: RecipeCardT[],
  totalCount: number,
  totalPages: number
}

export type RecipeResponseT = {
  recipe: RecipeT
}

export type RecipesFacetResultT = {
  results: RecipeCardT[];
  totalCount: { count: number }[];
};