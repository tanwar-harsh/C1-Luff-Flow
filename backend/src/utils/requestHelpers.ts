import { Request } from 'express';
import { IdParam } from '../validators/schemas';

export function getIdParam(req: Request): string {
  const params = req.validated?.params as IdParam;
  return params.id;
}
