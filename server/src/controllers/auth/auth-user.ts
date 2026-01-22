'use strict';

import type { Context } from 'koa';

import { userModel } from '../../models/user-model';

export const authUser = async function (ctx: Context) {
  const userId = ctx.state.user.userId;

  if (!userId) {
    ctx.status = 400;
    ctx.body = { error: 'No user ID. Please provide a valid user ID.'};
    return;
  }

  try {
    const user = await userModel.findById(userId).select("_id email");
    
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found. Please provide an ID for a valid user.'}
      return;
    }

    ctx.status = 200;
    ctx.body = { id: user._id.toString(), email: user.email };
  } catch (err) {
    console.log('Error fetching user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not fetch user.'}
  }
}