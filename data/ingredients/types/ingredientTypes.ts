'use strict';

export type SeasonalIngredient = {
  _id: string,
  name: string,
  seasonality: string[],
  foodGroup: string,
  altNames?: string[]
}

export type SeasonalIngredientProduct = {
  _id: string,
  name: string,
  parentIngredient: string,
  foodGroup: string,
  altNames?:  string[]
}

export type FallbackType = 
  | "ambiguous"
  | "specific"

export type SeasonalIngredientFallback = {
  _id: string,
  name: string,
  altNames?: string[],
  parentIngredients: string[],
  fallbackType: FallbackType
}

export type NonSeasonalIngredient = {
  _id: string,
  name: string,
  foodGroup: string,
  altNames?: string[]
}

export type SeasonalIngredientPayload = {
  availableIngredients: string[]
}