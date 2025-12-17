'use strict';

export type SeasonalIngredient = {
  name: string,
  altNames?: string[],
  seasonality: string[]
}

export type SeasonalIngredientCategories =
  | "fish"
  | "fruit"
  | "herbs"
  | "meat"
  | "nuts"
  | "poultry"
  | "shellfish"
  | "vegetables"

export type SeasonalIngredientDatabase = {
  [category in SeasonalIngredientCategories]: SeasonalIngredient[]
}

export type SeasonalIngredientProduct = {
  name: string,
  altNames?:  string[],
  parentIngredient: string
}

export type SeasonalIngredientProductCategories =
  | "fish"
  | "meat"
  | "poultry"
  | "shellfish"

export type SeasonalIngredientProductDatabase = {
  [category in SeasonalIngredientProductCategories]: SeasonalIngredientProduct[]
}

export type FallbackType = 
  | "ambiguous"
  | "specific"

export type SeasonalIngredientFallback = {
  name: string,
  altNames?: string[],
  parentIngredients: string[],
  fallbackType: FallbackType
}

export type SeasonalIngredientFallbackDatabase = SeasonalIngredientFallback[]

export type NonSeasonalIngredient = {
  name: string,
  altNames?: string[]
}

export type NonSeasonalIngredientCategories =
  | "curedMeat"
  | "curedFish"
  | "cheese"
  | "oil"
  | "vinegar"
  | "condiments"
  | "herbsAndSpices"
  | "stocksAndGravies"
  | "cannedVegetables"
  | "noodles"
  | "nuts"
  | "grains"
  | "pulses"
  | "breads"
  | "biscuits"
  | "crisps"
  | "dairy"
  | "eggs"
  | "baking"
  | "spreads"
  | "teaAndCoffee"
  | "confectionery"
  | "alcohol"
  | "juice"
  | "water"

export type NonSeasonalIngredientDatabase = {
  [category in NonSeasonalIngredientCategories]: NonSeasonalIngredient[]
}