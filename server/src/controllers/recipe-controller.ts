'use strict';

import type {Context} from 'koa';

const getRecipes = async function (ctx: Context) {
  console.log('Here are your recipes');
  ctx.body = { message: 'Here are your recipes'};
};

export {getRecipes};