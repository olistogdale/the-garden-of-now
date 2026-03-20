'use strict';

import { createApp } from './app';
import { config } from './config';
import { connectDB } from './database/db';

(async function () {
  try {
    await connectDB();

    const app = createApp();
    const PORT = config.port;
    const ENV = config.env;

    app.listen(PORT);

    console.log(`Server listening in ${ENV} mode on port ${PORT}`);
  } catch (err) {
    console.log('Server failed to start:', err);

    process.exit(1);
  }
})();
