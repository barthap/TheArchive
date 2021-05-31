import http, { Server } from 'http';

import Koa from 'koa';
import koaBody from 'koa-body';

import router from './api/routers/main';
import { DataContext } from './data/context';
import { startApolloServer } from './graphql/main';

type AppState = {
  dataManager: DataContext;
};

type CustomContext = object;

type KoaApplication = Koa<AppState, CustomContext>;
export type KoaAppContext = Koa.ParameterizedContext<AppState, CustomContext>;

const dataMiddleware: Koa.Middleware<AppState, CustomContext> = async (
  ctx,
  next
): Promise<void> => {
  console.log('creating data context...');

  ctx.state.dataManager = new DataContext();
  await next();
};

function createApp(): KoaApplication {
  const app = new Koa<AppState, CustomContext>() as KoaApplication;

  app.use(koaBody());
  app.use(dataMiddleware);
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

export default async function initAsync(): Promise<Server> {
  const app = createApp();

  const apolloServer = await startApolloServer();
  app.use(apolloServer.getMiddleware());

  const httpServer = http.createServer(app.callback());
  return httpServer;
}
