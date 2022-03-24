import { arrayValuesToType } from '@custom-types/array-values.type';
import {
  EEnglishLevelsType,
  EUserRole,
  EWorkExperienceInMonthsType
} from '@db/tables';
import QueryService from '@query/query.service';
import { DB } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { ITelegramCommandRessponse, ITelegramUpdateResponse } from '.';
import ETelegramButtonType from './enum/button-type.enum';
import ETelegramCheckboxButtonType from './enum/checkbox-button-type.enum';
import ETelegramCommandType from './enum/command-type.enum';
import ETelegramConfirmButtonType from './enum/confirm-button-type.enum';
import ETelegramEditButtonType from './enum/edit-button-type.enum';
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
          await telegramService.checkCommand(
            `${checkedBody.message.chat.id}`,
            checkedBody.message.message_id,
            `${checkedBody.message.from.id}`,
            checkedBody.message.text
          );
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

    const operationTypeWithExtraParam =
      checkedBody.callback_query.data.split(':')[0];
    const item = checkedBody.callback_query.data.split(':')[1];

    const operationType = operationTypeWithExtraParam.split('-')[0];
    const temporaryUserId = operationTypeWithExtraParam.split('-')[1];
    const extraOperationType = operationTypeWithExtraParam.split('-')[2];

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
          +item,
          +temporaryUserId
        );
        break;
      }
      case ETelegramButtonType.BACK: {
        await telegramService.selectCategory(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          checkedBody.callback_query.message.message_id
        );
        break;
      }
      case ETelegramButtonType.SELECT_CATEGORY_ITEM: {
        await telegramService.updateTemporaryUser(+temporaryUserId, {
          type: 'worker',
          categoryItemId: +item
        });
        await telegramService.selectSuccessWithInlineKeyboard(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          checkedBody.callback_query.message.message_id,
          checkedBody.callback_query.data,
          checkedBody.callback_query.message.reply_markup.inline_keyboard,
          ETelegramEditButtonType.CATEGORY,
          +temporaryUserId
        );
        await telegramService.selectExperience(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId
        );
        break;
      }
      case ETelegramButtonType.SELECT_EXPERIENCE: {
        await telegramService.updateTemporaryUser(+temporaryUserId, {
          type: 'worker',
          workExperience: item as arrayValuesToType<
            typeof EWorkExperienceInMonthsType.values
          >
        });
        await telegramService.selectSuccessWithInlineKeyboard(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          checkedBody.callback_query.message.message_id,
          checkedBody.callback_query.data,
          checkedBody.callback_query.message.reply_markup.inline_keyboard,
          ETelegramEditButtonType.EXPERIENCE,
          +temporaryUserId
        );
        await telegramService.selectSalary(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId
        );
        break;
      }
      case ETelegramButtonType.SELECT_ENGLISH_LEVEL: {
        await telegramService.updateTemporaryUser(+temporaryUserId, {
          type: 'worker',
          englishLevel: EEnglishLevelsType.values[+item]
        });
        await telegramService.selectCity(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId
        );
        break;
      }
      case ETelegramButtonType.SELECT_ENGLISH_LEVEL: {
        await telegramService.updateTemporaryUser(+temporaryUserId, {
          type: 'worker',
          englishLevel: EEnglishLevelsType.values[+item]
        });
        await telegramService.selectCity(
          checkedBody.callback_query.message.chat.id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId
        );
        break;
      }
      case ETelegramButtonType.ADD: {
        await telegramService.checkCheckboxButton(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId,
          extraOperationType as ETelegramCheckboxButtonType,
          'add',
          +item
        );
        break;
      }
      case ETelegramButtonType.DELETE: {
        await telegramService.checkCheckboxButton(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId,
          extraOperationType as ETelegramCheckboxButtonType,
          'delete',
          +item
        );
        break;
      }
      case ETelegramButtonType.SAVE: {
        await telegramService.checkCheckboxButton(
          checkedBody.callback_query.message.chat.id,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`,
          +temporaryUserId,
          extraOperationType as ETelegramCheckboxButtonType,
          'save',
          +item
        );
        break;
      }
      case ETelegramButtonType.YES: {
        await telegramService.checkYesButton(
          `${checkedBody.callback_query.message.chat.id}`,
          checkedBody.callback_query.message.message_id,
          `${checkedBody.callback_query.message.from.id}`,
          item as ETelegramConfirmButtonType
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
