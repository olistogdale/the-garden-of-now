'use strict';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import {authRouter} from '.routers/authRouter';
import {ingredientRouter} from '.routers/ingredientRouter';
import {recipeRouter} from '.routers/recipeRouter';
import {favouriteRouter} from '.routers/favouriteRouter';
import {config} from './config';

const app = new Koa();
const PORT = config.port;

app.use(cors());
app.use(bodyParser);
app.use(authRouter);
app.use(ingredientRouter);
app.use(recipeRouter);
app.use(favouriteRouter);

app.listen(PORT);

console.log(`Server listening on port ${PORT}`)

