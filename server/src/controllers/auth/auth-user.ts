'use strict';

import type { Context } from 'koa';

import { userModel } from '../../models/user-model';
import { PartialUserT, UserAuthResponseT } from '../../../../data/users/types/user-types';

export const authUser = async function (ctx: Context) {
  const userId = ctx.state.user.userId;

  try {
    const user = await userModel
      .findById(userId)
      .select({ email: 1, name: 1 })
      .lean<PartialUserT>();
    
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found (session invalid).'}
      return;
    }

    ctx.status = 200;
    const body: UserAuthResponseT = {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.name.first,
      lastName: user.name.last
    };
    ctx.body = body;
  } catch (err) {
    console.log('Error fetching user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not fetch user.'}
  }
}