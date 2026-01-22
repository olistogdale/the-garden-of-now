'use strict'

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/the_garden_of_now',
  jwtSecret: process.env.JWT_SECRET || 'd3f8ults3cr3t',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h'
};