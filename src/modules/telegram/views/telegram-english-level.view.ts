import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramEnglisLevelhView extends TelegramCommonView {
  public selectEnglishLevel = (
    language: languageTypes,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(
      this.messages[language].ENGLISH_LEVEL.DEFAULT,
      {}
    );

    extra.reply_markup = this.#getEnglishLevelButtonsKeyboardMarkup(
      language,
      temporaryUserId
    );

    return { text, extra };
  };

  #getEnglishLevelButtonsKeyboardMarkup = (
    language: languageTypes,
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages[language].ENGLISH_LEVEL.BUTTON.NO_ENGLISH,
            callback_data: `english_level-${temporaryUserId}:0`
          }
        ],
        [
          {
            text: this.messages[language].ENGLISH_LEVEL.BUTTON.A1,
            callback_data: `english_level-${temporaryUserId}:1`
          }
        ],
        [
          {
            text: this.messages[language].ENGLISH_LEVEL.BUTTON.A2,
            callback_data: `english_level-${temporaryUserId}:2`
          }
        ],
        [
          {
            text: this.messages[language].ENGLISH_LEVEL.BUTTON.B1,
            callback_data: `english_level-${temporaryUserId}:3`
          }
        ],
        [
          {
            text: this.messages[language].ENGLISH_LEVEL.BUTTON.B2,
            callback_data: `english_level-${temporaryUserId}:4`
          }
        ],
        [
          {
            text: this.messages[language].ENGLISH_LEVEL.BUTTON.C1,
            callback_data: `english_level-${temporaryUserId}:5`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };
}
