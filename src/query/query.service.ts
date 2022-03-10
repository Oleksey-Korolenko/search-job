import { Response } from 'express';
import HttpStatus from 'http-status-codes';

export default class QueryService {
  static sendResponse = <ResponseType>(
    status: number,
    values: ResponseType,
    res: Response
  ) => {
    res.status(status);
    return res.send({
      status,
      data: values,
    });
  };

  static errorResponse = (_err: unknown, res: Response) => {
    let status = HttpStatus.BAD_REQUEST;
    let message = `Something went wrong!`;
    if (_err instanceof Error) {
      message = _err.message;
    }
    if (_err instanceof TypeError) {
      message = _err.message;
      status = HttpStatus.FORBIDDEN;
    }
    return this.sendResponse<{
      message: string;
    }>(status, { message }, res);
  };
}
