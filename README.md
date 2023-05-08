# This is a example repository of ApolloServer and ApolloClient

This repository consists 2 packages of `backend` with ApolloServer and `frontend` with ApolloClient as a monorepo.

# Learn about GraphQL

Jump to `docs` directory

# How the sample application work

## Backend

Transpile TypeScript code to Node.js

```sh
yarn workspace backend compile
```

Run the code

```sh
yarn workspace backend start
```

## Frontend

-   Development Environment

1. create `.env` file like shown below

```.env
CDN_ENDPOINT=http://localhost:3000/graphql
LOG_LEVEL=DEBUG
```

2. Run webpack-dev-server

```sh
./packages/frontend/dev.sh start
```

-   Production Environment

1. Set up Environment values like `.env`

2. Bundle code with Webpack

```sh
yarn workspace frontend compile --config --config webpack.prod.js
```
