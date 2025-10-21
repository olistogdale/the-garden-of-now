'use strict';

import Router from 'koa-router';

import {getAdmin} from '../controllers/admin-controller.ts';

const adminRouter = new Router();

adminRouter.get('/admin', getAdmin);

export default adminRouter;