export type Role = 'ADMIN' | 'AGENT' | 'USER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedToId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  message: string;
  createdById: string;
  createdAt: string;
}

export interface CommentWithAuthor extends Comment {
  createdBy: UserSummary;
}

export interface TicketWithRelations extends Ticket {
  assignedTo: UserSummary | null;
  createdBy: UserSummary;
  comments: CommentWithAuthor[];
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: Priority;
  assignedTo?: string | null;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: Priority;
  assignedTo?: string | null;
}

export interface CreateCommentInput {
  message: string;
}

export interface SearchTicketsParams {
  q?: string;
  status?: TicketStatus;
}
