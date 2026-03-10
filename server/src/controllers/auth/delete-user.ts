import { userModel } from '../../models/user-model';

import type { Context } from 'koa';

export const deleteUser = async function(ctx: Context) {
  const userId = ctx.state.user.userId;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      ctx.status = 404;
      ctx.body = { error: 'User not found (session invalid).' };
      return;
    }

    ctx.cookies.set('accessToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      expires: new Date(0),
    });

    ctx.status = 204;
  } catch (err) {
    console.log('Error deleting user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not delete user.' };
  }
}
