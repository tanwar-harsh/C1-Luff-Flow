import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

type RequestSource = 'body' | 'query' | 'params';

export function validate<T>(schema: ZodSchema<T>, source: RequestSource) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }

    if (!req.validated) {
      req.validated = {};
    }
    req.validated[source] = result.data;
    next();
  };
}
