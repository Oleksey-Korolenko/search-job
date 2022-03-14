import { IArgsForPreparedText } from '.';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse,
} from './interface';
import messages from './messages';

export default class TelegramView {
  public selectLanguage = (): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages.en.START.DEFAULT, {});

    extra.reply_markup = this.#getLanguageButtonsKeyboardMarkup();

    return { text, extra };
  };

  #getLanguageButtonsKeyboardMarkup = (): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages.en.START.BUTTON.TYPE_LANGUAGE,
            callback_data: `lang_type:en`,
          },
        ],
        [
          {
            text: messages.uk.START.BUTTON.TYPE_LANGUAGE,
            callback_data: `lang_type:uk`,
          },
        ],
      ] as IInlineKeyboardButton[][],
    };
  };

  #preparedText = (text: string, args: IArgsForPreparedText): string => {
    const textVatiableForReplace = text.match(/\{[A-Za-z_0-9]+\}/g);

    if (textVatiableForReplace === null) {
      return text;
    }

    let preparedText: string = '';

    textVatiableForReplace.forEach((it) => {
      const arg = args[it.split('{')[1].split('}')[0]];

      if (preparedText === '') {
        preparedText = text.replace(
          it,
          `${arg === null || arg === undefined ? 'інформація відсутня' : arg}`
        );
      } else {
        preparedText = preparedText.replace(
          it,
          `${arg === null || arg === undefined ? 'інформація відсутня' : arg}`
        );
      }
    });

    return preparedText;
  };
}
