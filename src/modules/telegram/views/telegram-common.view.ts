import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import ETelegramConfirmButtonType from '../enum/confirm-button-type.enum';
import {
  IArgsForPreparedText,
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  IPreparedTranslate
} from '../interface';
import languagePack, { languageTypes } from '../messages';

export default class TelegramCommonView {
  protected messages: typeof languagePack;

  constructor() {
    this.messages = languagePack;
  }

  protected preparedText = (
    text: string,
    args: IArgsForPreparedText
  ): string => {
    const textVatiableForReplace = text.match(/\{[A-Za-z_0-9]+\}/g);

    if (textVatiableForReplace === null) {
      return text;
    }

    let preparedText: string = '';

    textVatiableForReplace.forEach(it => {
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

  protected preparedTranslate = (
    language: languageTypes,
    itemList: INotPreparedTranslate[]
  ): IPreparedTranslate[] => {
    switch (language) {
      case 'ua': {
        return itemList.map(it => ({
          id: it.id,
          translate: it.name,
          isExist: it.isExist
        }));
      }
      default: {
        return itemList.map(it => ({
          id: it.id,
          translate: it.translate[language],
          isExist: it.isExist
        }));
      }
    }
  };

  protected getYesOrNoButtonKeyboardMarkup = (
    language: languageTypes,
    operationType: ETelegramConfirmButtonType
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.YES,
            callback_data: `yes:${operationType}`
          }
        ],
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.NO,
            callback_data: `no:${operationType}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  protected getCheckboxButtonsKeyboardMarkup = (
    language: languageTypes,
    temporaryUserId: number,
    preparedTranslate: IPreparedTranslate[],
    checkboxType: ETelegramCheckboxButtonType,
    isSaveButton: boolean
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        ...preparedTranslate.map(it =>
          it.isExist
            ? [
                {
                  text: this.preparedText(
                    this.messages[language].DEFAULT_BUTTON.DELETE,
                    { item: it.translate }
                  ),
                  callback_data: `delete-${temporaryUserId}-${checkboxType}:${it.id}`
                } as IInlineKeyboardButton
              ]
            : [
                {
                  text: this.preparedText(
                    this.messages[language].DEFAULT_BUTTON.ADD,
                    { item: it.translate }
                  ),
                  callback_data: `add-${temporaryUserId}-${checkboxType}:${it.id}`
                } as IInlineKeyboardButton
              ]
        ),
        isSaveButton && [
          {
            text: this.messages[language].DEFAULT_BUTTON.SAVE,
            callback_data: `save-${temporaryUserId}-${checkboxType}`
          }
        ]
      ].filter(Boolean) as IInlineKeyboardButton[][]
    };
  };
}
