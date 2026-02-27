import mongoose from 'mongoose'

import { config } from '../config'

export async function connectDB(uri = config.mongoURI) {
  await mongoose.connect(uri);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export {mongoose}