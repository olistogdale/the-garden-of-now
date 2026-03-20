import mongoose from 'mongoose';

import { config } from '../config';

export async function connectDB(uri = config.mongoURI) {
  try {
    await mongoose.connect(uri);
    console.log('Mongoose connected.');
  } catch (err) {
    console.log('Mongoose failed to connect:', err);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export { mongoose };
