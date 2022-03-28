import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import TelegramCommonView from './telegram-common.view';

export default class TelegramLanguageView extends TelegramCommonView {
  public selectLanguage = (): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages.en.START.DEFAULT, {});

    extra.reply_markup = this.#getLanguageButtonsKeyboardMarkup();

    return { text, extra };
  };

  #getLanguageButtonsKeyboardMarkup = (): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages.en.START.BUTTON.TYPE_LANGUAGE,
            callback_data: `lang_type:en`
          }
        ],
        [
          {
            text: this.messages.ua.START.BUTTON.TYPE_LANGUAGE,
            callback_data: `lang_type:ua`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };
}
