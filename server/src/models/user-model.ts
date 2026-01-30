'use strict';

import {mongoose} from '../database/db';

import type {UserT, NameT, RecipeEntryT} from '../../../data/users/types/user-types';

const {Schema, model} = mongoose;

const RecipeEntrySchema = new Schema <RecipeEntryT> (
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    addedAt: {type: Date, default: Date.now}
  }
);

const NameSchema = new Schema <NameT> (
  {
    first: {type: String, required: true},
    last: {type: String, required: true}
  },
  {_id: false}
);

const UserSchema = new Schema <UserT> (
  {
    name: {type: NameSchema, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    emailVerified: {type: Boolean, default: false},
    passwordHash: {type: String, required: true},
    favouriteRecipes: {type: [RecipeEntrySchema], default: []},
    role: {type: String, enum: ['user', 'admin'], default: 'user', required: true},
    lastLoginAt: {type: Date}
  },
  {timestamps: true}
);

export const userModel = model('User', UserSchema);
