import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { createRepositories, Repositories } from './repositories';
import { createRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

export function createApp(repositories?: Repositories): Express {
  const app = express();
  const repos = repositories ?? createRepositories(prisma);

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(morgan(env.NODE_ENV === 'test' ? 'tiny' : 'dev'));
  app.use(express.json());

  app.use('/api', createRoutes(repos));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
