import Router from 'koa-router';

import {getAvailableRecipes, getRecipe} from '../controllers/recipes/index';

const recipeRouter = new Router();

recipeRouter.get('/recipes', getAvailableRecipes);
recipeRouter.get('/recipes/:id', getRecipe)

export default recipeRouter;