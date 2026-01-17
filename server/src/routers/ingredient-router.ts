import Router from 'koa-router'

import { getAvailableIngredients } from '../controllers/ingredients/get-available-ingredients';

const ingredientRouter = new Router();

ingredientRouter.get('/ingredients/:month', getAvailableIngredients);

export default ingredientRouter;