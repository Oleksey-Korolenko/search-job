import ETelegramEditButtonType from '../enum/edit-button-type.enum';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramSuccessView extends TelegramCommonView {
  public selectSuccess = (
    language: languageTypes,
    item: string | INotPreparedTranslate[],
    operationType: ETelegramEditButtonType,
    typeMessage: 'item' | 'list',
    temporaryUserId?: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    if (typeMessage === 'item') {
      text += this.preparedText(
        this.messages[language].DEFAULT_MESSAGE.SUCCESS,
        {
          item: item as string
        }
      );
    } else {
      const preparedItemTranslate = this.preparedTranslate(
        language,
        item as INotPreparedTranslate[]
      );

      text += this.preparedText(
        this.messages[language].DEFAULT_MESSAGE.SUCCESS_LIST,
        {}
      );

      preparedItemTranslate.forEach(
        it =>
          (text += this.preparedText(
            this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
            {
              item: it.translate
            }
          ))
      );
    }

    extra.reply_markup = this.#getEditButtonKeyboardMarkup(
      language,
      operationType,
      temporaryUserId
    );

    return { text, extra };
  };

  #getEditButtonKeyboardMarkup = (
    language: languageTypes,
    operationType: ETelegramEditButtonType,
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.EDIT,
            callback_data: `edit-${temporaryUserId}:${operationType}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };
}
