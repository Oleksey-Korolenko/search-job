import { asyncHandler } from '@middlewares/async-handler.middleware';
import QueryService from '@query/query.service';
import { Request, Response, Router } from 'express';
import ExampleService from './example.service';

export default (router: typeof Router) => {
  const routes = router();

  const exampleService = new ExampleService();

  routes.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      return QueryService.sendResponse<string>(200, 'response', res);
    })
  );

  return routes;
};
