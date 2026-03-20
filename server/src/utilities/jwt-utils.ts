import jwt from 'jsonwebtoken';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';

import { config } from '../config';

export const signAccessToken = function (userID: string) {
  if (userID.trim().length === 0) throw new Error('Invalid user ID.');

  return jwt.sign({ sub: userID }, config.jwtSecret, {
    expiresIn: config.jwtExpiration as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = function (token: string) {
  if (token.trim().length === 0) throw Error('Invalid token.');

  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
