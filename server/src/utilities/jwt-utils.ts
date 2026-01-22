import jwt from 'jsonwebtoken';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';

import { config } from '../config'
  
export const signAccessToken = function(userID: string) {
  return jwt.sign(
    { sub: userID } satisfies JwtPayload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiration as SignOptions['expiresIn'] }
  )
}

export const verifyAccessToken = function(token: string) {
  return jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
}
