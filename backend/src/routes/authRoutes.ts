import { Router } from 'express';
import { Services } from '../services';
import { createAuthController } from '../controllers/authController';
import { validate } from '../validators/validate';
import { loginSchema, registerSchema } from '../validators/schemas';
import { authenticate } from '../middlewares/authenticate';

export function createAuthRoutes(services: Services): Router {
  const router = Router();
  const controller = createAuthController(services);

  router.post('/register', validate(registerSchema, 'body'), controller.register);
  router.post('/login', validate(loginSchema, 'body'), controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/logout', controller.logout);
  router.get('/me', authenticate, controller.me);

  return router;
}
