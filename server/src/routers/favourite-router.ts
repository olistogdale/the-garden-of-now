'use strict';

import Router from 'koa-router';

import { getFavourites, postFavourite, deleteFavourite } from '../controllers/favourites/index';

const favouriteRouter = new Router();

favouriteRouter.post('/favourites', getFavourites);
favouriteRouter.post('/favourites', postFavourite);
favouriteRouter.delete('/favourites/:id', deleteFavourite);

export default favouriteRouter;