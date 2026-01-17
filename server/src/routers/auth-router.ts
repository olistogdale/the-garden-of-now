'use strict';

import Router from 'koa-router';

import { getAuth } from '../controllers/auth-controller';

const authRouter = new Router();

authRouter.get('/auth', getAuth);

export default authRouter;