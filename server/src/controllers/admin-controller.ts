'use strict';

import type { Context } from 'koa';

const getAdmin = async function (ctx: Context) {
  console.log('Recipes loaded into database');
  ctx.body = { message: 'Recipes loaded into database' };
};

export { getAdmin };