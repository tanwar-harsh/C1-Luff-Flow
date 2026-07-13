import { Comment, CommentWithAuthor, CreateCommentData } from '../../types/domain';

export interface ICommentRepository {
  create(data: CreateCommentData): Promise<Comment>;
  findByTicketId(ticketId: string): Promise<CommentWithAuthor[]>;
}
