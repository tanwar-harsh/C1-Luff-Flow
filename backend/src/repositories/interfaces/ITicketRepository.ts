import {
  CreateTicketData,
  Ticket,
  TicketSearchParams,
  TicketStatus,
  TicketWithRelations,
  UpdateTicketData,
} from '../../types/domain';

export interface ITicketRepository {
  create(data: CreateTicketData): Promise<Ticket>;
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  findByIdWithRelations(id: string): Promise<TicketWithRelations | null>;
  update(id: string, data: UpdateTicketData): Promise<Ticket>;
  updateStatus(id: string, status: TicketStatus): Promise<Ticket>;
  search(params: TicketSearchParams): Promise<Ticket[]>;
}
