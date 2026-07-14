import { Request } from 'express';
import { Role } from '../types/domain';

declare global {
  namespace Express {
    interface Request {
      validated?: Partial<Record<'body' | 'query' | 'params', unknown>>;
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
