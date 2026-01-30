'use strict';

import { userModel } from '../../models/user-model';

import type { Context } from 'koa';

export const deleteFavourite = async function(ctx: Context) {
  const userId = ctx.state.user.userId;
  const { recipeId } = ctx.params;

  if (typeof recipeId !== 'string' || !recipeId.trim()) {
    ctx.status = 400;
    ctx.body = { error: 'No recipe ID. Please provide a valid recipe ID.'};
    return;
  }

  try {
    const result = await userModel.updateOne(
      {
        _id: userId,
        'favouriteRecipes.recipeId': recipeId
      },
      {
        $pull: {
          favouriteRecipes: {
            _id: recipeId
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

      ctx.status = 404;
      ctx.body = { error: 'Favourite recipe not found. Please provide an ID for a valid recipe.'};
      return;
    }

    ctx.status = 204;
  } catch (err) {
    console.log('Error deleting favourite recipe:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error: could not delete favourite recipe.'};
  }
}