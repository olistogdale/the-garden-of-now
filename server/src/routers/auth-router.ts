'use strict';

import Router from 'koa-router';

import {
  registerUser,
  loginUser,
  authUser,
  logoutUser,
  deleteUser,
} from '../controllers/auth/index';
import { requireAuth } from '../middleware/auth';

const authRouter = new Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/auth', requireAuth, authUser);
authRouter.post('/logout', requireAuth, logoutUser);
authRouter.delete('/delete', requireAuth, deleteUser);

export default authRouter;
