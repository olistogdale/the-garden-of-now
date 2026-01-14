'use strict';

export type ImageData = {
  url: string,
  width: number,
  height: number,
}

export type NutritionData = {
  calories: string,
  fatContent: string,
  saturatedFatContent: string,
  carbohydrateContent: string,
  sugarContent: string,
  fiberContent: string,
  proteinContent: string,
  sodiumContent: string
}

export type Ingredient = {
  quantity: string,
  description: string,
  ingredient: string,
  rawIngredients: string[],
  preparation: string
}

export type IngredientData = {
  text: string,
  optional: boolean,
  ingredientOptions?: Ingredient[]
}

export type Instruction = {
  text: string
}

export type IngredientGroup = string[]

export type Recipe = {
  _id: string,
  name: string,
  description: string,
  image: ImageData[],
  url: string,
  keywords?: string,
  prepTime?: string,
  cookTime?: string,
  totalTime?: string,
  nutrition?: NutritionData,
  cuisine?: string,
  skillLevel?: string,
  yield?: string,
  category?: string,
  ingredients: IngredientData[],
  instructions: Instruction[],
  groupedIngredients: IngredientGroup[]
}

export type RecipeCard = {
  _id: string,
  name: string,
  image: ImageData[],
  prepTime?: string,
  cookTime?: string,
  totalTime?: string,
  skillLevel?: string,
}

export type FacetRecipeResult = {
  results: RecipeCard[];
  totalCount: {count: number}[];
};