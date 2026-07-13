import { Request, Response } from 'express';
import { Services } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { getIdParam } from '../utils/requestHelpers';
import {
  CreateTicketBody,
  SearchTicketsQuery,
  UpdateStatusBody,
  UpdateTicketBody,
} from '../validators/schemas';

export function createTicketController(services: Services) {
  const createTicket = asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated!.body as CreateTicketBody;
    const ticket = await services.ticketService.createTicket(body);
    res.status(201).json(successResponse(ticket));
  });

  const listTickets = asyncHandler(async (_req: Request, res: Response) => {
    const tickets = await services.ticketService.listTickets();
    res.status(200).json(successResponse(tickets));
  });

  const getTicketById = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    const ticket = await services.ticketService.getTicketById(id);
    res.status(200).json(successResponse(ticket));
  });

  const updateTicket = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    const body = req.validated!.body as UpdateTicketBody;
    const ticket = await services.ticketService.updateTicket(id, body);
    res.status(200).json(successResponse(ticket));
  });

  const updateTicketStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    const body = req.validated!.body as UpdateStatusBody;
    const ticket = await services.ticketService.updateTicketStatus(id, body.status);
    res.status(200).json(successResponse(ticket));
  });

  const searchTickets = asyncHandler(async (req: Request, res: Response) => {
    const query = req.validated!.query as SearchTicketsQuery;
    const tickets = await services.ticketService.searchTickets(query);
    res.status(200).json(successResponse(tickets));
  });

  return {
    createTicket,
    listTickets,
    getTicketById,
    updateTicket,
    updateTicketStatus,
    searchTickets,
  };
}
