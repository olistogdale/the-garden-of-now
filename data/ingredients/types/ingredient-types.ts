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

export type IngredientT = {
  name: string,
  altNames?: string[]
}

export type IngredientsResponsePayloadT = {
  ingredients: string[]
}