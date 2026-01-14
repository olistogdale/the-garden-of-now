'use strict';

import Router from 'koa-router';

import {getFavourites, postFavourite, deleteFavourite} from '../controllers/favourites/post-favourite-recipe';

const favouriteRouter = new Router();

favouriteRouter.post('/favourites', getFavourites);
favouriteRouter.post('/favourites/:id', postFavourite);
favouriteRouter.delete('/favourites/:id', deleteFavourite);

export default favouriteRouter;