import Router from 'koa-router'

import { getIngredients } from '../controllers/ingredients/get-ingredients';

const ingredientRouter = new Router();

ingredientRouter.get('/ingredients/:month', getIngredients);

export default ingredientRouter;