'use strict';

import Router from 'koa-router';

import { getFavourites, postFavourite, deleteFavourite } from '../controllers/favourites/index';
import { requireAuth } from '../middleware/auth';

const favouriteRouter = new Router();

favouriteRouter.post('/favourites', requireAuth, getFavourites);
favouriteRouter.post('/favourite', requireAuth, postFavourite);
favouriteRouter.delete('/favourite/:recipeId', requireAuth, deleteFavourite);

export default favouriteRouter;
