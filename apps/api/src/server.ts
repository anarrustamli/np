import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { healthRouter } from './routes/health';

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_URL ?? '*',
      credentials: true
    })
  );
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      message: 'Workflow Automation API',
      environment: env.NODE_ENV
    });
  });

  app.use('/health', healthRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
