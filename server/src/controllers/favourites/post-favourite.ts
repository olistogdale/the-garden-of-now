'use strict';

import { FavouriteRequestT, FavouriteResponseT } from '../../../../data/users/types/user-types';
import { userModel } from '../../models/user-model';

import type { Context } from 'koa';


export const postFavourite = async function(ctx: Context) {
  const userId = ctx.state.user.userId;
  const { recipeId, recipeName } = ctx.request.body as FavouriteRequestT;

  if (typeof recipeId !== 'string' || !recipeId.trim() || typeof recipeName !== 'string' || ! recipeName.trim()) {
    ctx.status = 400;
    ctx.body = { error: 'No recipe name or ID. Please provide a valid recipe name and ID.'}
    return;
  }

  try {
    const addedAt = new Date();
    const result = await userModel.updateOne(
      {
        _id: userId,
        'favouriteRecipes._id': { $ne: recipeId },
      },
      {
        $push: {
          favouriteRecipes: {
            _id: recipeId,
            name: recipeName,
            addedAt,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      const exists = await userModel.exists({ _id: userId });

      if (!exists) {
        ctx.status = 404;
        ctx.body = { error: 'User not found. Please provide an ID for a valid user.'};
        return;
      }

      ctx.status = 409;
      ctx.body = { error: 'Favourite already saved to user profile.'};
      return;
    };

    ctx.status = 201;
    const body: FavouriteResponseT = {
      recipeId,
      recipeName,
      addedAt
    }
    ctx.body = body;
  } catch (err) {
    console.log('Error posting favourite recipe:', err)
    ctx.status = 500;
    ctx.body = { error: 'Internal server error: could not post favourite recipe.'}
  }
}