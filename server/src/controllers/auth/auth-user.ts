'use strict';

import type { Context } from 'koa';

import { userModel } from '../../models/user-model';
import { UserAuthResponseT } from '../../../../data/users/types/user-types';

export const authUser = async function (ctx: Context) {
  const userID = ctx.state.user.userId;

  if (!userID) {
    ctx.status = 401;
    ctx.body = { error: 'No user ID. Please provide a valid user ID.'};
    return;
  }

  try {
    const user = await userModel.findById(userID).select("_id email");
    
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'User not found. Please provide an ID for a valid user.'}
      return;
    }

    ctx.status = 200;
    ctx.body = { _id: user._id.toString(), email: user.email } as UserAuthResponseT;
  } catch (err) {
    console.log('Error fetching user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not fetch user.'}
  }
}