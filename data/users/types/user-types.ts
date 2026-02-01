'use strict';

import type { RecipeCardT } from "../../recipes/types/recipe-types.js";

export type NameT = {
  first: string,
  last: string
};

export type RecipeEntryT = {
  _id: string,
  name: string,
  addedAt: Date
}

export type RoleT = 'admin' | 'user';

export type UserT = {
  _id: string,
  name: NameT,
  email: string,
  emailVerified: boolean,
  passwordHash: string,
  favouriteRecipes: RecipeEntryT[],
  role: RoleT,
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date
};

export type PartialUserT = {
  _id: string,
  name: NameT,
  email: string,
  favouriteRecipes: RecipeEntryT[]
}

export type UserRegistrationRequestT = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export type UserLoginRequestT = {
  email: string,
  password: string
}


export type UserAuthResponseT = {
  userId: string,
  email: string
  firstName: string,
  lastName: string,
  favourites: RecipeEntryT[]
}

export type FavouriteCardT = RecipeCardT & {
  inSeason: boolean
}

export type FavouritesRequestT = {
  ingredients: string[]
}

export type FavouritesResponseT =  {
  recipes: FavouriteCardT[],
  totalCount: number,
  totalPages: number
} 

export type FavouriteRequestT = {
  recipeId: string
  recipeName: string
}

export type FavouriteResponseT = {
  recipeId: string,
  recipeName: string,
  addedAt: Date
}