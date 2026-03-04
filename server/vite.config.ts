import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      MONGO_URI: "mongodb://localhost:27017/test",
      JWT_SECRET: "test-secret",
      CLIENT_ORIGIN: "http://localhost:3000",
      PORT: "3000"
    },
    globals: true
  }
})