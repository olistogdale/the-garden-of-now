'use strict';

import Router from 'koa-router';

import { registerUser, loginUser, authUser } from '../controllers/auth/index';

const authRouter = new Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/auth/me', authUser); 

export default authRouter;