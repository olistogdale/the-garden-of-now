'use strict'

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.port || '3000'),
  env: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI || 'mongoDB://localhost:27017/the_garden_of_now'
};

