'use strict';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import authRouter from './routers/auth-router';
import ingredientRouter from './routers/ingredient-router';
import recipeRouter from './routers/recipe-router';
import favouriteRouter from './routers/favourite-router';
import { config } from './config';

const app = new Koa();
const PORT = config.port;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser());
app.use(authRouter.routes());
app.use(ingredientRouter.routes());
app.use(recipeRouter.routes());
app.use(favouriteRouter.routes());

app.listen(PORT);

console.log(`Server listening on port ${PORT}`)

