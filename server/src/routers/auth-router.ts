'use strict';

import Router from 'koa-router';

import {getAuth} from '../controllers/auth-controller.ts';

const authRouter = new Router();

authRouter.get('/auth', getAuth);

export default authRouter;