'use strict';

export type SeasonalIngredient = {
  name: string,
  altNames?: string[],
  seasonality: string[]
}

export type SeasonalIngredientDatabase = {
  fish: SeasonalIngredient[],
  fruit: SeasonalIngredient[],
  herbs: SeasonalIngredient[],
  meat: SeasonalIngredient[],
  nuts: SeasonalIngredient[],
  poultry: SeasonalIngredient[],
  shellfish: SeasonalIngredient[],
  vegetables: SeasonalIngredient[]
}

export type SeasonalIngredientProduct = {
  name: string,
  altNames?:  string[],
  parentIngredient: string
}

export type SeasonalIngredientProductDatabase = {
  fish: SeasonalIngredientProduct[],
  meat: SeasonalIngredientProduct[],
  poultry: SeasonalIngredientProduct[],
  shellfish: SeasonalIngredientProduct[]
}

export type SeasonalIngredientFallback = {
  name: string,
  altNames?: string[],
  parentIngredients: string[],
  fallbackType: string
}

export type SeasonalIngredientFallbackDatabase = SeasonalIngredientFallback[]

export type NonSeasonalIngredient = {
  name: string,
  altNames: string[]
}

export type NonSeasonalIngredientDatabase = {
  curedMeat: NonSeasonalIngredient[],
  curedFish: NonSeasonalIngredient[],
  cheese: NonSeasonalIngredient[],
  oil: NonSeasonalIngredient[],
  vinegar: NonSeasonalIngredient[],
  condiments: NonSeasonalIngredient[],
  herbsAndSpices: NonSeasonalIngredient[],
  stocksAndGravies: NonSeasonalIngredient[],
  cannedVegetables: NonSeasonalIngredient[],
  noodles: NonSeasonalIngredient[],
  nuts: NonSeasonalIngredient[],
  grains: NonSeasonalIngredient[],
  pulses: NonSeasonalIngredient[],
  breads: NonSeasonalIngredient[],
  biscuits: NonSeasonalIngredient[],
  crisps: NonSeasonalIngredient[],
  dairy: NonSeasonalIngredient[],
  eggs: NonSeasonalIngredient[],
  baking: NonSeasonalIngredient[],
  spreads: NonSeasonalIngredient[],
  teaAndCoffee: NonSeasonalIngredient[],
  confectionery: NonSeasonalIngredient[],
  alcohol: NonSeasonalIngredient[],
  juice: NonSeasonalIngredient[],
  water: NonSeasonalIngredient[]
}