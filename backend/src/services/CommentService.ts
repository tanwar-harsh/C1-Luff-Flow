import { Comment, CreateCommentData } from '../types/domain';
import { ICommentRepository } from '../repositories/interfaces/ICommentRepository';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';
import { NotFoundError } from '../utils/AppError';
import { UserService } from './UserService';

export interface CreateCommentInput {
  message: string;
  createdBy: string;
}

export class CommentService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly ticketRepository: ITicketRepository,
    private readonly userService: UserService,
  ) {}

  async addComment(ticketId: string, input: CreateCommentInput): Promise<Comment> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    await this.userService.ensureUserExists(input.createdBy, 'createdBy');

    const data: CreateCommentData = {
      ticketId,
      message: input.message,
      createdById: input.createdBy,
    };

    return this.commentRepository.create(data);
  }
}
