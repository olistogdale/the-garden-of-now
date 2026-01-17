import Router from 'koa-router';

import { getAvailableRecipes, getRecipe } from '../controllers/recipes/index';

const recipeRouter = new Router();

recipeRouter.post('/recipes', getAvailableRecipes);
recipeRouter.get('/recipes/:id', getRecipe)

export default recipeRouter;