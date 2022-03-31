import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramErrorView extends TelegramCommonView {
  public selectTemporaryUserError = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].TEMPORARY_USER.ERROR, {});

    extra.reply_markup = this.#getYesOrNoButtonKeyboardMarkup(language);

    return { text, extra };
  };

  public selectExistAccError = (language: languageTypes): string => {
    let text = '';

    text += this.preparedText(
      this.messages[language].TEMPORARY_USER.EXIST_ACC,
      {}
    );

    return text;
  };

  #getYesOrNoButtonKeyboardMarkup = (
    language: languageTypes
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.YES,
            callback_data: `yes_temporary`
          }
        ],
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.NO,
            callback_data: `no_temporary`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };
}
