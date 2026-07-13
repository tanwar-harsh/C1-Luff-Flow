import { PrismaClient } from '@prisma/client';
import { CommentRepository } from './CommentRepository';
import { TicketRepository } from './TicketRepository';
import { UserRepository } from './UserRepository';
import { ICommentRepository } from './interfaces/ICommentRepository';
import { ITicketRepository } from './interfaces/ITicketRepository';
import { IUserRepository } from './interfaces/IUserRepository';

export interface Repositories {
  userRepository: IUserRepository;
  ticketRepository: ITicketRepository;
  commentRepository: ICommentRepository;
}

export function createRepositories(prisma: PrismaClient): Repositories {
  return {
    userRepository: new UserRepository(prisma),
    ticketRepository: new TicketRepository(prisma),
    commentRepository: new CommentRepository(prisma),
  };
}
