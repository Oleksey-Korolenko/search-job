import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { request, RequestOptions } from 'https';
import EQueryCode from './enum/query.enum';
import ETypeOperation from './enum/type-operation.enum';
import {
  IQueryAttributes,
  IQueryParams,
  IQueryResponse
} from './interface/query.inteface';

export default class QueryService {
  static sendResponse = <ResponseType>(
    status: number,
    data: ResponseType,
    res: Response
  ) => {
    res.status(status);
    return res.send({
      status,
      data
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

  public sendRequest = <Headers, ResponseType, BodyType>(
    attributes: IQueryAttributes<Headers>,
    params: IQueryParams,
    typeOperation: ETypeOperation,
    body?: BodyType
  ): Promise<IQueryResponse<ResponseType, EQueryCode>> => {
    let preparedParams = '';

    for (const key in params) {
      if (!params[key]) {
        continue;
      }

      preparedParams += `${key}=${params[key]}&`;
    }

    switch (typeOperation) {
      case ETypeOperation.DEFAULT: {
        return this.#default<Headers, ResponseType, BodyType>(
          attributes,
          preparedParams,
          body
        );
      }
    }
  };

  #default = <Headers, ResponseType, BodyType>(
    attributes: IQueryAttributes<Headers>,
    preparedParams: string,
    body?: BodyType
  ): Promise<IQueryResponse<ResponseType, EQueryCode>> => {
    return new Promise<IQueryResponse<ResponseType, EQueryCode>>(
      (resolve, reject) => {
        const req = request(
          {
            ...attributes,
            path: `${attributes.path}?${preparedParams}`
          } as unknown as RequestOptions,
          res => {
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', chunk => {
              responseBody += chunk;
            });
            res.on('end', () => {
              try {
                resolve({
                  code: EQueryCode.OK,
                  message: 'Everything is correct!',
                  data: JSON.parse(responseBody)
                } as IQueryResponse<ResponseType, EQueryCode>);
              } catch (e) {
                reject({
                  code: EQueryCode.BAD_REQUEST,
                  message: e?.message ?? 'Bad request!'
                } as IQueryResponse<ResponseType, EQueryCode>);
              }
            });
          }
        );

        if (body !== undefined) {
          req.write(JSON.stringify(body));
        }

        req.on('error', e => {
          reject({
            code: EQueryCode.BAD_REQUEST,
            message: e.message ?? 'Bad request!'
          } as IQueryResponse<ResponseType, EQueryCode>);
        });

        req.end();
      }
    );
  };
}
