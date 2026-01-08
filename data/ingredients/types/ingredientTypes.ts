'use strict';

export type SeasonalIngredient = {
  name: string,
  seasonality: string[],
  foodGroup: string,
  altNames?: string[]
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

export type SeasonalIngredientProductCollection =
  { _id?: string } & {
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

export type SeasonalIngredientFallbackCollection = SeasonalIngredientFallback[]

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

export type NonSeasonalIngredientCollection =
  { _id?: string } & {
    [category in NonSeasonalIngredientCategories]: NonSeasonalIngredient[]
  }
