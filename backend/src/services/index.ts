import { Repositories } from '../repositories';
import { CommentService } from './CommentService';
import { TicketService } from './TicketService';
import { UserService } from './UserService';

export interface Services {
  userService: UserService;
  ticketService: TicketService;
  commentService: CommentService;
}

export function createServices(repositories: Repositories): Services {
  const userService = new UserService(repositories.userRepository);
  const ticketService = new TicketService(
    repositories.ticketRepository,
    userService,
  );
  const commentService = new CommentService(
    repositories.commentRepository,
    repositories.ticketRepository,
    userService,
  );

  return {
    userService,
    ticketService,
    commentService,
  };
}
