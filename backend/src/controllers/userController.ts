import { Request, Response } from 'express';
import { Services } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import {
  AdminCreateUserBody,
  AdminUpdateUserBody,
  PaginationQuery,
  UpdateMeBody,
} from '../validators/schemas';
import { getIdParam } from '../utils/requestHelpers';

export function createUserController(services: Services) {
  const listUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.validated!.query as PaginationQuery;
    const result = await services.userService.listUsersPaginated(page, limit);
    res.status(200).json(successResponse(result));
  });

  const listAssignees = asyncHandler(async (_req: Request, res: Response) => {
    const users = await services.userService.listUsers();
    res.status(200).json(successResponse(users));
  });

  const getUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    const user = await services.userService.getUserByIdOrThrow(id);
    res.status(200).json(successResponse(user));
  });

  const createUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated!.body as AdminCreateUserBody;
    const user = await services.userService.createUser(body);
    res.status(201).json(successResponse(user));
  });

  const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    const body = req.validated!.body as AdminUpdateUserBody;
    const user = await services.userService.updateUser(id, body);
    res.status(200).json(successResponse(user));
  });

  const updateMe = asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated!.body as UpdateMeBody;
    const user = await services.userService.updateMe(req.user!.id, body);
    res.status(200).json(successResponse(user));
  });

  const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    await services.userService.deleteUser(id);
    res.status(200).json(successResponse({ message: 'User deleted' }));
  });

  return {
    listUsers,
    listAssignees,
    getUser,
    createUser,
    updateUser,
    updateMe,
    deleteUser,
  };
}
