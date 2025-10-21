'use strict';

import type { Context } from 'koa';

const getAuth = async function (ctx: Context) {
  console.log('Here is your authentication');
  ctx.body = { message: 'Here is your authentication' };
};

export { getAuth };