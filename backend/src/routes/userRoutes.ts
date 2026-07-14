import { Router } from 'express';
import { Services } from '../services';
import { createUserController } from '../controllers/userController';
import { validate } from '../validators/validate';
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  idParamSchema,
  paginationQuerySchema,
  updateMeSchema,
} from '../validators/schemas';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

export function createUserRoutes(services: Services): Router {
  const router = Router();
  const controller = createUserController(services);

  router.patch(
    '/me',
    authenticate,
    validate(updateMeSchema, 'body'),
    controller.updateMe,
  );

  router.get(
    '/assignees',
    authenticate,
    authorize('ADMIN', 'AGENT'),
    controller.listAssignees,
  );

  router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(paginationQuerySchema, 'query'),
    controller.listUsers,
  );

  router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(adminCreateUserSchema, 'body'),
    controller.createUser,
  );

  router.get(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(idParamSchema, 'params'),
    controller.getUser,
  );

  router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(idParamSchema, 'params'),
    validate(adminUpdateUserSchema, 'body'),
    controller.updateUser,
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(idParamSchema, 'params'),
    controller.deleteUser,
  );

  return router;
}
