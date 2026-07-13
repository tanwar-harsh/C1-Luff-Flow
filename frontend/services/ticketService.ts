import { apiGet, apiPatch, apiPost, apiPut } from './api';
import {
  CreateCommentInput,
  CreateTicketInput,
  SearchTicketsParams,
  Ticket,
  TicketStatus,
  TicketWithRelations,
  UpdateTicketInput,
} from '@/types/domain';
import { Comment } from '@/types/domain';

export async function fetchTickets(): Promise<Ticket[]> {
  return apiGet<Ticket[]>('/tickets');
}

export async function fetchTicketById(id: string): Promise<TicketWithRelations> {
  return apiGet<TicketWithRelations>(`/tickets/${id}`);
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return apiPost<Ticket>('/tickets', input);
}

export async function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
  return apiPut<Ticket>(`/tickets/${id}`, input);
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
  return apiPatch<Ticket>(`/tickets/${id}/status`, { status });
}

export async function addComment(ticketId: string, input: CreateCommentInput): Promise<Comment> {
  return apiPost<Comment>(`/tickets/${ticketId}/comments`, input);
}

export async function searchTickets(params: SearchTicketsParams): Promise<Ticket[]> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.status) query.set('status', params.status);
  const qs = query.toString();
  return apiGet<Ticket[]>(`/tickets/search${qs ? `?${qs}` : ''}`);
}
