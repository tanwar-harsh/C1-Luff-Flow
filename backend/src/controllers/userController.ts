import { Request, Response } from 'express';
import { Services } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';

export function createUserController(services: Services) {
  const listUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await services.userService.listUsers();
    res.status(200).json(successResponse(users));
  });

  return { listUsers };
}
