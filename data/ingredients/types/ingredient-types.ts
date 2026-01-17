'use strict';

export type SeasonalIngredientT = {
  _id: string,
  name: string,
  seasonality: string[],
  foodGroup: string,
  altNames?: string[]
}

export type NonSeasonalIngredientT = {
  _id: string,
  name: string,
  foodGroup: string,
  altNames?: string[]
}

export type IngredientRetrievalT = {
  name: string,
  altNames?: string[]
}

export type AvailableIngredientPayloadT = {
  availableIngredients: string[]
}

export type AvailableIngredientSeedPayloadT = AvailableIngredientPayloadT & {seed: string}