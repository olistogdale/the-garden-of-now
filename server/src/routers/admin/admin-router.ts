'use strict';

import Router from 'koa-router';

import {getAdmin} from '../../controllers/admin/admin-controller';

const adminRouter = new Router();

adminRouter.get('/admin', getAdmin);

export default adminRouter;