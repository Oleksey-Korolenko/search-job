import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramUserRoleView extends TelegramCommonView {
  public selectRole = (
    language: languageTypes,
    isWorker: boolean,
    isEmployer: boolean
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].SELECT_ROLE.DEFAULT, {});

    extra.reply_markup = this.#getRoleButtonsKeyboardMarkup(
      language,
      isWorker,
      isEmployer
    );

    return { text, extra };
  };

  #getRoleButtonsKeyboardMarkup = (
    language: languageTypes,
    isWorker: boolean,
    isEmployer: boolean
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        isWorker && [
          {
            text: this.messages[language].SELECT_ROLE.BUTTON.WORKER,
            callback_data: `role_type:worker`
          }
        ],
        isEmployer && [
          {
            text: this.messages[language].SELECT_ROLE.BUTTON.EMPLOYER,
            callback_data: `role_type:employer`
          }
        ]
      ].filter(Boolean) as IInlineKeyboardButton[][]
    };
  };
}
