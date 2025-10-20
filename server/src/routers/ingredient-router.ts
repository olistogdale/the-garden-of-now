import Router from 'koa-router'

import {getIngredients} from '../controllers/ingredient-controller';

const ingredientRouter = new Router();

ingredientRouter.get('/ingredients', getIngredients);

export default ingredientRouter;