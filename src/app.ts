import http, { Server } from 'http';

import Koa from 'koa';
import koaBody from 'koa-body';

import router from './api/routers/main';
import { startApolloServer } from './graphql/main';

type State = object;
type Context = object;

type KoaApplication = Koa<State, Context>;

function createApp(): KoaApplication {
  const app = new Koa<State, Context>() as KoaApplication;

  // app.use(sentry.getMiddleware());
  // app.use(koaUtils.errorMiddleware);
  app.use(koaBody());
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

export default async function initAsync(): Promise<Server> {
  const app = createApp();

  const apolloServer = await startApolloServer();
  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app.callback());
  return httpServer;
}
