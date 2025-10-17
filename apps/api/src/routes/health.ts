import { Router } from 'express';

import { buildHealthResponse } from '@workflow-saas/shared';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json(buildHealthResponse());
});
