# The Archive

Successor of my old [TheDiary] (https://github.com/barthap/TheDiary).

Other name ideas:

- The Story Archive
- The Interactive Story
- Story Interactive
- Interactive Story Archive
- ???

### Roadmap

- [ ] Implement DataLoader
  - [x] For entities
  - [ ] For references
- [ ] Remove duplicates
  - [ ] From queries (maybe)
  - [ ] From entities (byId, all)
- [ ] Structure App Context
  - [ ] Move current context to data
  - [ ] Make ability to choose global/per-request
  - [ ] Add koa request context
- [ ] Automatic data migrations
  - [ ] File upload and storage
- [ ] Integration tests
- [ ] Mutations (after migrations to be able to reset data)
- [ ] Move to monorepo structure (yarn workspaces / lerna) - packages client + server
- [ ] Docker deployment
- [ ] CI
- [ ] Web Frontend
- [ ] Add full example story
