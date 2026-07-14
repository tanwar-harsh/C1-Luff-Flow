import { Router } from 'express';
import { Services } from '../services';
import { createTicketController } from '../controllers/ticketController';
import { createCommentController } from '../controllers/commentController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../validators/validate';
import {
  createCommentSchema,
  createTicketSchema,
  idParamSchema,
  searchTicketsSchema,
  updateStatusSchema,
  updateTicketSchema,
} from '../validators/schemas';

const staffOnly = [authenticate, authorize('AGENT', 'ADMIN')];

export function createTicketRoutes(services: Services): Router {
  const router = Router();
  const ticketController = createTicketController(services);
  const commentController = createCommentController(services);

  // Search must be registered before /:id to avoid route collision
  router.get(
    '/search',
    authenticate,
    validate(searchTicketsSchema, 'query'),
    ticketController.searchTickets,
  );

  router.get('/', authenticate, ticketController.listTickets);

  router.post(
    '/',
    ...staffOnly,
    validate(createTicketSchema, 'body'),
    ticketController.createTicket,
  );

  router.get(
    '/:id',
    authenticate,
    validate(idParamSchema, 'params'),
    ticketController.getTicketById,
  );

  router.put(
    '/:id',
    ...staffOnly,
    validate(idParamSchema, 'params'),
    validate(updateTicketSchema, 'body'),
    ticketController.updateTicket,
  );

  router.patch(
    '/:id/status',
    ...staffOnly,
    validate(idParamSchema, 'params'),
    validate(updateStatusSchema, 'body'),
    ticketController.updateTicketStatus,
  );

  router.post(
    '/:id/comments',
    ...staffOnly,
    validate(idParamSchema, 'params'),
    validate(createCommentSchema, 'body'),
    commentController.addComment,
  );

  return router;
}
