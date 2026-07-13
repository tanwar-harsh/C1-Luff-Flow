import { PrismaClient } from '@prisma/client';
import { Comment, CommentWithAuthor, CreateCommentData } from '../types/domain';
import { ICommentRepository } from './interfaces/ICommentRepository';

const userSummarySelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export class CommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateCommentData): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        ticketId: data.ticketId,
        message: data.message,
        createdById: data.createdById,
      },
    });
  }

  async findByTicketId(ticketId: string): Promise<CommentWithAuthor[]> {
    return this.prisma.comment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        createdBy: { select: userSummarySelect },
      },
    });
  }
}
