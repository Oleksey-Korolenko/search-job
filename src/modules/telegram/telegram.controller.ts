import QueryService from '@query/query.service';
import { DB } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { ITelegramCommandRessponse, ITelegramUpdateResponse } from '.';
import ETelegramCommandType from './enum/command-type.enum';
import TelegramApiService from './telegram.api.service';
import TelegramService from './telegram.service';

export default async (router: typeof Router, db: DB) => {
  const routes = router();

  const telegramService = new TelegramService();
  await new TelegramApiService().setWebhook();
  const queryService = QueryService;

  const tgCommandHandler = async (
    checkedBody: ITelegramUpdateResponse | ITelegramCommandRessponse
  ) => {
    if (
      typeof checkedBody.message.text === 'string' &&
      checkedBody.message.text[0] === '/'
    ) {
      switch (checkedBody.message.text.split('@')[0]) {
        case ETelegramCommandType.START: {
          await telegramService.selectLanguage(checkedBody.message.chat.id);
          break;
        }
      }
    }
  };

  routes.post('/update', async (req: Request, res: Response) => {
    const body: ITelegramUpdateResponse | ITelegramCommandRessponse = req.body;

    if ({}.hasOwnProperty.call(body, 'message')) {
      await tgCommandHandler(body);
    }

    return queryService.sendResponse<{}>(200, {}, res);
  });

  return routes;
};
