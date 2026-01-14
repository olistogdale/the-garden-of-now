'use strict';

import {mongoose} from '../database/db';

import type {User, Name, RecipeEntry} from '../../../data/users/types/user-types';

const {Schema, model} = mongoose;

const RecipeEntrySchema = new Schema <RecipeEntry> (
  {
    recipeID: {type: String, required: true},
    name: {type: String, required: true},
    addedAt: {type: Date, default: Date.now}
  },
  {_id: false}
);

const NameSchema = new Schema <Name> (
  {
    first: {type: String, required: true},
    last: {type: String, required: true}
  },
  {_id: false}
);

const UserSchema = new Schema <User> (
  {
    _id: {type: String, required: true},
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

UserSchema.index(
  { _id: 1, 'favouriteRecipes.recipeID': 1 },
  { unique: true, sparse: true }
);

export const userModel = model('User', UserSchema);