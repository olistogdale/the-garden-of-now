import Router from "koa-router";

const healthRouter = new Router();

healthRouter.get('/health', (ctx) => {
  ctx.status = 200;
  ctx.body = { ok: true };
})

export default healthRouter