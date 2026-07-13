import { Router } from 'express';
import { Repositories } from '../repositories';
import { createServices } from '../services';
import { createHealthRoutes } from './healthRoutes';
import { createUserRoutes } from './userRoutes';
import { createTicketRoutes } from './ticketRoutes';

export function createRoutes(repositories: Repositories): Router {
  const router = Router();
  const services = createServices(repositories);

  router.use(createHealthRoutes());
  router.use('/users', createUserRoutes(services));
  router.use('/tickets', createTicketRoutes(services));

  return router;
}
