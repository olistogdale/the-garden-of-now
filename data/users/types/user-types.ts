'use strict';

export type Name = {
  first: string,
  last: string
};

export type RecipeEntry = {
  recipeID: string,
  name: string,
  addedAt: Date
}

export type Role = 'admin' | 'user';

export type User = {
  _id: string,
  name: Name,
  email: string,
  emailVerified: boolean,
  passwordHash: string,
  favouriteRecipes: RecipeEntry[],
  role: Role,
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date
};