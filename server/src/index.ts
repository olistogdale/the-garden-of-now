'use strict';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import authRouter from './routers/auth-router.ts';
import ingredientRouter from './routers/ingredient-router.ts';
import recipeRouter from './routers/recipe-router.ts';
import favouriteRouter from './routers/favourite-router.ts';
import adminRouter from './routers/admin-router.ts';
import config from './config.ts';

const app = new Koa();
const PORT = config.port;

app.use(cors());
app.use(bodyParser());
app.use(authRouter.routes());
app.use(ingredientRouter.routes());
app.use(recipeRouter.routes());
app.use(favouriteRouter.routes());

app.listen(PORT);

console.log(`Server listening on port ${PORT}`)

