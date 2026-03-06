import Router from 'koa-router';

import { changePassword } from '../controllers/profile/change-password';
import { requireAuth } from '../middleware/auth';

const profileRouter = new Router();

profileRouter.patch('/me/password', requireAuth, changePassword)

export default profileRouter;