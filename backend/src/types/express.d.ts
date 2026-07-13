import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      validated?: Partial<Record<'body' | 'query' | 'params', unknown>>;
    }
  }
}

export {};
