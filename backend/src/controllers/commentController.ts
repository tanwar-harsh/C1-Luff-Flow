import { Request, Response } from 'express';
import { Services } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { getIdParam } from '../utils/requestHelpers';
import { CreateCommentBody } from '../validators/schemas';

export function createCommentController(services: Services) {
  const addComment = asyncHandler(async (req: Request, res: Response) => {
    const id = getIdParam(req);
    const body = req.validated!.body as CreateCommentBody;
    const comment = await services.commentService.addComment(id, {
      message: body.message,
      createdBy: req.user!.id,
    });
    res.status(201).json(successResponse(comment));
  });

  return { addComment };
}
