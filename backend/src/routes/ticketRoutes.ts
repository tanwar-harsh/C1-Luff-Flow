import { Router } from 'express';
import { Services } from '../services';
import { createTicketController } from '../controllers/ticketController';
import { createCommentController } from '../controllers/commentController';
import { validate } from '../validators/validate';
import {
  createCommentSchema,
  createTicketSchema,
  idParamSchema,
  searchTicketsSchema,
  updateStatusSchema,
  updateTicketSchema,
} from '../validators/schemas';

export function createTicketRoutes(services: Services): Router {
  const router = Router();
  const ticketController = createTicketController(services);
  const commentController = createCommentController(services);

  // Search must be registered before /:id to avoid route collision
  router.get(
    '/search',
    validate(searchTicketsSchema, 'query'),
    ticketController.searchTickets,
  );

  router.get('/', ticketController.listTickets);

  router.post(
    '/',
    validate(createTicketSchema, 'body'),
    ticketController.createTicket,
  );

  router.get(
    '/:id',
    validate(idParamSchema, 'params'),
    ticketController.getTicketById,
  );

  router.put(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateTicketSchema, 'body'),
    ticketController.updateTicket,
  );

  router.patch(
    '/:id/status',
    validate(idParamSchema, 'params'),
    validate(updateStatusSchema, 'body'),
    ticketController.updateTicketStatus,
  );

  router.post(
    '/:id/comments',
    validate(idParamSchema, 'params'),
    validate(createCommentSchema, 'body'),
    commentController.addComment,
  );

  return router;
}
