import Router from 'koa-router'

import {getAvailableIngredients} from '../controllers/ingredient-controller';

const ingredientRouter = new Router();

ingredientRouter.get('/ingredients/:month', getAvailableIngredients);

export default ingredientRouter;