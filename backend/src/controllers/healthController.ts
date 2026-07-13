import { Request, Response } from 'express';
import { successResponse } from '../utils/apiResponse';

export function healthCheck(_req: Request, res: Response): void {
  res.status(200).json(
    successResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
  );
}
