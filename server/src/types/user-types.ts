import type { Types } from 'mongoose';
import type { NameT, RecipeEntryT, RoleT } from '../../../data/users/types/user-types'

export type CreateUserT = {
  name: NameT,
  email: string,
  passwordHash: string,
  lastLoginAt: Date,
}

export type UserDocT = {
  _id: Types.ObjectId,
  name: NameT,
  email: string,
  emailVerified: boolean,
  passwordHash: string,
  favouriteRecipes: RecipeEntryT[],
  role: RoleT,
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date
}