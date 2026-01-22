'use strict';

import Router from 'koa-router';

import { registerUser, loginUser, authUser, logoutUser } from '../controllers/auth/index';

const authRouter = new Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/auth/me', authUser); 
authRouter.post('/logout', logoutUser);

export default authRouter;