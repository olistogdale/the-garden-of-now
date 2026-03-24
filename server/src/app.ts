import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import authRouter from './routers/auth-router';
import ingredientRouter from './routers/ingredient-router';
import recipeRouter from './routers/recipe-router';
import favouriteRouter from './routers/favourite-router';
import profileRouter from './routers/profile-router';
import healthRouter from './routers/health-router';
import { config } from './config';

export function createApp() {
  const app = new Koa();
  app.proxy = config.isProd;

  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: true,
    }),
  );
  app.use(bodyParser());

  app.use(authRouter.routes());
  app.use(ingredientRouter.routes());
  app.use(recipeRouter.routes());
  app.use(favouriteRouter.routes());
  app.use(profileRouter.routes());
  app.use(healthRouter.routes());

  return app;
}
