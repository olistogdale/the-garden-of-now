'use strict';

import Router from 'koa-router';

import {getFavourites} from '../controllers/favourite-controller';

const favouriteRouter = new Router();

favouriteRouter.get('/favourites', getFavourites);

export default favouriteRouter;