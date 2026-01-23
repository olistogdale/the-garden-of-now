'use strict';

export type NameT = {
  first: string,
  last: string
};

export type RecipeEntryT = {
  recipeID: string,
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
  _id: string,
  email: string
}