import Router from 'koa-router';

import { getRecipes, getRecipe } from '../controllers/recipes/index';

const recipeRouter = new Router();

recipeRouter.post('/recipes', getRecipes);
recipeRouter.get('/recipes/:recipeId', getRecipe)

export default recipeRouter;