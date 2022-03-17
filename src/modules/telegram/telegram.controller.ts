import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole } from '@db/tables';
import QueryService from '@query/query.service';
import { DB } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { ITelegramCommandRessponse, ITelegramUpdateResponse } from '.';
import ETelegramButtonType from './enum/button-type.enum';
import ETelegramCommandType from './enum/command-type.enum';
import { ITelegramButtonResponse } from './interface';
import { languageTypes } from './messages';
import TelegramApiService from './telegram.api.service';
import TelegramService from './telegram.service';

export default async (router: typeof Router, db: DB) => {
  const routes = router();

  const telegramService = new TelegramService(db);
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
        default: {
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
    const item = checkedBody.callback_query.data.split(':')[1];

    switch (operationType) {
      case ETelegramButtonType.SELECT_LANGUAGE: {
        await telegramService.saveTelegramInfo({
          userId: `${checkedBody.callback_query.message.from.id}`,
          language: item as languageTypes,
          username: checkedBody.callback_query.message.from.username
        });
        await telegramService.selectRole(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`
        );
        break;
      }
      case ETelegramButtonType.SELECT_ROLE: {
        await telegramService.actionForRole(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`,
          item as arrayValuesToType<typeof EUserRole.values>
        );
        break;
      }
      case ETelegramButtonType.SELECT_CATEGORY: {
        await telegramService.selectCategoryItems(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`,
          +item
        );
        break;
      }
      case ETelegramButtonType.BACK: {
        await telegramService.selectCategory(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  routes.post('/update', async (req: Request, res: Response) => {
    if ({}.hasOwnProperty.call(req.body, 'message')) {
      const checkedBody = req.body as
        | ITelegramUpdateResponse
        | ITelegramCommandRessponse;

      await tgCommandHandler(checkedBody);
    } else if ({}.hasOwnProperty.call(req.body, 'callback_query')) {
      const checkedBody = req.body as ITelegramButtonResponse;

      await tgButtonHandler(checkedBody, res);
    }

    return queryService.sendResponse<{}>(200, {}, res);
  });

  return routes;
};
