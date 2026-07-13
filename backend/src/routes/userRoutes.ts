import { Router } from 'express';
import { Services } from '../services';
import { createUserController } from '../controllers/userController';

export function createUserRoutes(services: Services): Router {
  const router = Router();
  const controller = createUserController(services);

  router.get('/', controller.listUsers);

  return router;
}
