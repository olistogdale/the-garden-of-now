'use strict';

import bcrypt from 'bcryptjs';

import { userModel } from '../../models/user-model';

import type { Context } from 'koa';
import type { UserT } from '../../../../data/users/types/user-types';

type ChangePasswordRequestT = {
  currentPassword: string,
  newPassword: string
}

export const changePassword = async function (ctx: Context) {
  const userId = ctx.state.user.userId;
  const { currentPassword, newPassword } = ctx.request.body as ChangePasswordRequestT;

  if (
    typeof currentPassword !== 'string' ||
    currentPassword.length === 0 ||
    currentPassword.trim() !== currentPassword ||
    typeof newPassword !== 'string' ||
    newPassword.length < 8 ||
    newPassword.trim() !== newPassword
  ) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid password input. Please provide a valid current password and a new password at least 8 characters in length.' };
    return;
  }

  try {
    const user = await userModel.findById<UserT>(userId).select({ passwordHash: 1 });

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found (session invalid).' };
      return;
    }

    const currentPasswordCorrect = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!currentPasswordCorrect) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid password. Please provide a valid current password.' };
      return;
    }

    const newPasswordMatchesCurrent = await bcrypt.compare(newPassword, user.passwordHash);

    if (newPasswordMatchesCurrent) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid new password. Your new password must be different to your current password.' };
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await userModel.updateOne({ _id: userId }, { $set: { passwordHash: newPasswordHash } });

    ctx.status = 204;
  } catch (err) {
    console.log('Error changing user password:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not change user password.' };
  }
}