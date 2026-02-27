'use strict';

import { createApp } from "./app";
import { config } from "./config";

const app = createApp();
const PORT = config.port;

app.listen(PORT);

console.log(`Server listening on port ${PORT}`)

