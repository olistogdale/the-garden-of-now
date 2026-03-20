# ---- Build Stage ----

FROM node:22-alpine AS builder

WORKDIR /app

# Copy root + workspace manifests
COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
COPY data/package.json ./data/package.json
COPY server/tsconfig.json ./server/tsconfig.json

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Build the server
RUN npm run -w server build

# ---- Runtime Stage ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json

# Install only production deps for server workspace
RUN npm ci --omit=dev --workspace server

# Copy compiled output
COPY --from=builder /app/server/dist ./server/dist

WORKDIR /app/server

EXPOSE 8080

CMD ["node", "dist/server/src/index.js"]