'use strict';

export type SeasonalIngredient = {
  _id: string,
  name: string,
  seasonality: string[],
  foodGroup: string,
  altNames?: string[]
}

export type NonSeasonalIngredient = {
  _id: string,
  name: string,
  foodGroup: string,
  altNames?: string[]
}

export type IngredientRetrieval = {
  name: string,
  altNames?: string[]
}

export type AvailableIngredientPayload = {
  availableIngredients: string[]
}