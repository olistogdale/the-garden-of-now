'use strict';

import Router from 'koa-router';

import {getFavouriteRecipes, postFavouriteRecipe, deleteFavouriteRecipe} from '../controllers/favourites/index';

const favouriteRouter = new Router();

favouriteRouter.post('/favourites', getFavouriteRecipes);
favouriteRouter.post('/favourites/:id', postFavouriteRecipe);
favouriteRouter.delete('/favourites/:id', deleteFavouriteRecipe);

export default favouriteRouter;