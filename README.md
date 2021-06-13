# The Archive

Successor of my old [TheDiary] (https://github.com/barthap/TheDiary).

Other name ideas:

- The Story Archive
- The Interactive Story
- Story Interactive
- Interactive Story Archive
- ???

### Roadmap

- [x] Implement DataLoader
  - [x] For entities
  - [ ] For references (make group queryies)
- [x] Structure App Context
  - [x] Move current context to data
  - [ ] Make ability to choose global/per-request
  - [x] Add koa request context
- [x] Automatic data migrations
  - [ ] File upload and storage
- [ ] Integration tests
- [x] Mutations (after migrations to be able to reset data)
  - [ ] Mutations for rest entities
  - [ ] Entity updates
- [ ] Move to monorepo structure (yarn workspaces / lerna) - packages client + server
- [ ] Docker deployment
- [ ] CI
- [ ] Web Frontend
- [ ] Add full example story

## Installation

#### Prerequisities

- Direnv
- A Postgres database

1. Install dependencies:

```
yarn install
```

2. Go to `.direnv/local` and copy `.envrc.example` into `.envrc`. Open the file and provide database connection info.

3. Run the database migrations by running `yarn migrate`.

## Running

Start the server:

```
yarn start
```

Then the GraphQL playground will be available at http://localhost.3009/graphql
