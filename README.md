# The Garden of Now

The Garden of Now is a cloud-hosted web-app for seasonal eating. Discover inspiring dishes made entirely from locally-sourced ingredients.

## Live Demo

The app can be found live at [www.gardenofnow.co.uk](https://www.gardenofnow.co.uk). Have a look around, or follow the instructions below to launch a local development version.

## Overview

Eating seasonally is better for everyone. Consumers get locally-sourced ingredients that are fresher, tastier, and free from preservatives. Food miles are slashed, reducing the carbon footprint of the supply chain. And then there's the economic benefit - putting more money into the hands of local growers and farmers, who see a fairer share of the profit.

But cooking up seasonal dishes isn't without its challenges. It's difficult keeping track of available ingredients as the seasons change, and trickier still to find the inspiration to turn them into something good to eat. That's where The Garden of Now comes in. Powered by a custom ingredients ontology and a database of over 8,000 recipes, it recommends a range of mouth-watering dishes that can be made using only ingredients in season right now. Through a secure profile, users can save their favourite dishes for later, creating a seasonal recipe book they can access month in, month out.

## Tech Stack

- Frontend: TypeScript, React, React Router, Vite
- Backend: TypeScript, Node.js, Koa
- Database: Mongoose, MongoDB
- Authentication: JWT with cookie-based auth
- Testing: Vitest, Testing Library, Supertest, Mongo Memory Server
- Code Quality: ESLint, Prettier
- CI/CD: GitHub Actions
- Containerisation: Docker, AWS ECR
- Frontend Infrastructure: AWS S3/CloudFront
- Backend Infrastructure: AWS ECS/Fargate

## Architecture

### File Structure

The project is structured as an npm workspaces monorepo with separate client, server and data packages. This streamlines the client, server and shared data definitions, allowing for consistency between front and back end whilst preserving clear boundaries between application layers.

The production version of the app is found on the 'main' branch of the remote repo. Feature development is handled on dedicated feature branches, with changes merged into the 'dev' branch for testing and beta.

### Frontend

The frontend is built using React, TypeScript and Vite. React provides an unopinionated and flexible platform for a stateful and route-based UI with authenticated and unauthenticated flows and reusable components. TypeScript helps to keep the flow of data between layers explicit and structured. Styling is handled using pure CSS and a central CSS variable library which offers the consistency and rigour of a styling framework with finer control over styling where necessary, whilst also maintaining clear separation of concerns.

### Backend

The backend is built using Node.js, TypeScript and Koa. Koa was chosen for its lightweight and modular architecture, which allows smooth integration of middleware for authentication/authorization pathways, schema-based validation, etc. Its unopinionated style also makes routing logic more explicit and easier to reason about.

### Data/Persistence

MongoDB in conjunction with Mongoose is used for persistent data storage. With a custom ingredient ontology comprising four distinct libraries, as well as recipe and user documentation, the flexibility of a NoSQL database was a better fit. Furthermore, with MongoDB's query layer mirroring TS logic, filtering, pagination and data retrieval could be handled 'in-query', significantly reducing data transfer across the layer for faster response times.

### Authentication

Authentication is handled using JWTs stored in HTTP-only cookies. This allows for a stateless server authentication model which improves potential scalability and performance for future deployments whilst significantly reducing backend complexity (e.g. no need for a Redis cache). With sensitive user data limited (no personal details, financial details etc.), implicit token invalidation is a reasonable tradeoff.

### Testing & Code Quality

The codebase includes both front- and backend tests, along with linting and formatting. Core user pathways are extensively supported across both client and server by integration tests, validating route behaviour, authentication flows and API logic holistically. Unit tests are used to validate helper and utility functions where relevant to maximise meaningful coverage.

### Deployment

The frontend is deployed as static assets to AWS S3 behind CloudFront. The backend is containerised using Docker and deployed to ECS/Fargate via AWS ECR. Automatic load balancing allows for secure HTTPS transfer as well as future scalability at a minimal cost. CI/CD is managed through GitHub Actions - CI is triggered on pushes or pull requests to dev, with CD triggered on pushes to main, the production branch. Deployment to AWS is authenticated through GitHub OIDC to avoid the use of persistent access keys.

## Local Development

### App Launch

Follow the steps below to run a local version of the app:

1. Navigate to your preferred directory and clone a copy of the project to your local files.
```bash
cd < directory path >
git clone https://www.GitHub.com/olistogdale/the-garden-of-now
```

2. Install a copy of MongoDB to your machine using Homebrew, or through the MongoDB website, and launch it.
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

3. Navigate to the project root and install the required project dependencies.
```bash
cd the-garden-of-now
npm ci
```

4. Navigate to the client directory, create a .env file...
```bash
cd client
touch .env
```
...and configure frontend environment variables as follows:
```env
VITE_API_BASE_URL=/api
```

5. Navigate to the server directory, create a .env file...
```bash
cd ../server
touch .env
```
...and configure backend environment variables as follows:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/the_garden_of_now
JWT_SECRET=< insert JWT secret here >
JWT_EXPIRATION=30m
CLIENT_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

6. Whilst in the server directory, seed the database with the recipe library and ingredient ontology.
```bash
npm run seed
```

7. Open a fresh terminal, navigate to the project root and spin up a development version of the server.
```bash
cd < insert path here >/the-garden-of-now
npm run -w server dev
``` 

8. Finally, open a fresh terminal, navigate to the project root and launch a development version of the client.
```bash
cd < insert path here >/the-garden-of-now
npm run -w client dev
```

9. Run the app through your browser at the following address:
```
http://localhost:5173
```

### Code Amendments

Follow the steps below (as required) to validate the codebase after making changes to the code. These commands can be run from the project root, server or client directories as necessary.

1. Format the code using...
```bash
npm run format
```
...or check to see what formatting errors remain in the code using...
```bash
npm run format:check
```

2. Lint the code using...
```bash
npm run lint
```

3. Run tests across both client and server using...
```bash
npm run test
```
...and check existing test coverage using...
```bash
npm run coverage
```

## Engineering Decisions

### Recipe Database and Ingredient Ontology

The heart of the project is the custom ingredient ontology and recipes database, without which the app architecture would be redundant. An early decision was made to scrape the recipe data from BBC Good Food rather than access it through an API like Spoonacular. There were two reasons for this - firstly, these recipes were more appropriate to ingredients locally sourced within the UK, and secondly, the recipe data was cleaner and better structured.

A TS/Node.js data pipeline scrapes and structures the data. A future refinement will be to rewrite this in Python, harnessing the power of language processing libraries like NLTK to streamline and improve ingredient parsing.

### MongoDB Query Layer

As much of the server request logic as possible - filtering, sorting, paginating - has been handled in the Mongo query layer instead of Node. The size of the recipe library (well over 8000 recipes) makes data transfer across the DB/server layer a non-trivial consideration - pushing server logic down into the query layer significantly reduces the quantity of data transferred, improving response times.

Nonetheless, challenges have arisen. Originally, the app was designed to randomize recipe results (using a session key as a hash) to prevent recipe inspiration from becoming stale from session to session. Handling this in Node would have required the added complexity of a server cache. Handling this in the query layer through a random-sort function was simple and efficient, but was only supported by the premium tier of MongoDB Atlas, and was too costly. This original architecture is preserved in the project branch 'mongo-native-version'.

### Proxy Server Pathway

In order to facilitate the development of a responsive design system for the app, a proper mobile experience (beyond Chrome Devtools) was key. To access the app on mobile, Vite was configured to operate using a proxy server, accessing the generic '/api' pathway and allowing for both local connections and connections across the local network. As such, a mobile-browser-native dev version of the app could be spun up simultaneously with a desktop browser version.
