'use strict';

import type {Context} from 'koa';

const getFavourites = async function (ctx: Context) {
  console.log('Here are your favourites');
  ctx.body = { message: 'Here are your favourites'};
};

export {getFavourites};