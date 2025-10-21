import Router from 'koa-router';

import {getRecipes} from '../controllers/recipe-controller.ts';

const recipeRouter = new Router();

recipeRouter.get('/recipes', getRecipes);

export default recipeRouter;