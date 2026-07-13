export type Role = 'ADMIN' | 'AGENT' | 'USER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedToId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  ticketId: string;
  message: string;
  createdById: string;
  createdAt: Date;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TicketWithRelations extends Ticket {
  assignedTo: UserSummary | null;
  createdBy: UserSummary;
  comments: CommentWithAuthor[];
}

export interface CommentWithAuthor extends Comment {
  createdBy: UserSummary;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: Priority;
  createdById: string;
  assignedToId?: string | null;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: Priority;
  assignedToId?: string | null;
}

export interface CreateCommentData {
  ticketId: string;
  message: string;
  createdById: string;
}

export interface TicketSearchParams {
  q?: string;
  status?: TicketStatus;
}
