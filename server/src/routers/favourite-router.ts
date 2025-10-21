'use strict';

import Router from 'koa-router';

import {getFavourites} from '../controllers/favourite-controller.ts';

const favouriteRouter = new Router();

favouriteRouter.get('/favourites', getFavourites);

export default favouriteRouter;