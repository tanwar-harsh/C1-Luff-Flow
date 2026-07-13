import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

export function createHealthRoutes(): Router {
  const router = Router();

  router.get('/health', healthCheck);

  return router;
}
