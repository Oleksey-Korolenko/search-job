import QueryService from '@query/query.service';
import { DB } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { ITelegramCommandRessponse, ITelegramUpdateResponse } from '.';
import ETelegramButtonType from './enum/button-type.enum';
import ETelegramCommandType from './enum/command-type.enum';
import { ITelegramButtonResponse } from './interface';
import { languagePackType } from './messages';
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

  const tgButtonHandler = async (
    checkedBody: ITelegramButtonResponse,
    res: Response
  ) => {
    if (typeof checkedBody.callback_query.data !== 'string') {
      return queryService.sendResponse<{}>(200, {}, res);
    }

    const operationType = checkedBody.callback_query.data.split(':')[0];
    const lang = checkedBody.callback_query.data.split(':')[1];

    switch (operationType) {
      case ETelegramButtonType.SELECT_LANGUAGE: {
        await telegramService.selectRole(
          lang as keyof languagePackType,
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id
        );
        break;
      }
    }
  };

  routes.post('/update', async (req: Request, res: Response) => {
    const body:
      | ITelegramUpdateResponse
      | ITelegramCommandRessponse
      | ITelegramButtonResponse = req.body;

    if ({}.hasOwnProperty.call(body, 'message')) {
      const checkedBody = body as unknown as
        | ITelegramUpdateResponse
        | ITelegramCommandRessponse;

      await tgCommandHandler(checkedBody);
    } else if ({}.hasOwnProperty.call(body, 'callback_query')) {
      const checkedBody = body as unknown as ITelegramButtonResponse;

      await tgButtonHandler(checkedBody, res);
    }

    return queryService.sendResponse<{}>(200, {}, res);
  });

  return routes;
};
