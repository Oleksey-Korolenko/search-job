import QueryService from '@query/query.service';
import { NextFunction, Request, Response } from 'express';

export const catchError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    QueryService.errorResponse(err, res);
  } else {
    next();
  }
};
