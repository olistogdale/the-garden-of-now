'use strict';

import type {Context} from 'koa';

const getIngredients = async function (ctx: Context) {
  console.log('Here are your ingredients');
  ctx.body = { message: 'Here are your ingredients'};
};

export {getIngredients};