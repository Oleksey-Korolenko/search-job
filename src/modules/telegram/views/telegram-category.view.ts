import { CategoryItemType, CategoryType } from '@db/tables';
import ETelegramBackButtonType from '../enum/back-button-type.enum';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  IPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramCategoryView extends TelegramCommonView {
  public selectCategory = (
    language: languageTypes,
    categories: CategoryType[],
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].CATEGORY.DEFAULT, {});

    const preparedTranslate = this.preparedTranslate(
      language,
      categories as INotPreparedTranslate[]
    );

    extra.reply_markup = this.#getCategoryButtonsKeyboardMarkup(
      language,
      true,
      preparedTranslate,
      temporaryUserId
    );

    return { text, extra };
  };

  public selectCategoryItem = (
    language: languageTypes,
    category: CategoryType,
    categoryItems: CategoryItemType[],
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].CATEGORY.ITEM, {
      category: category.name
    });

    const preparedTranslate = this.preparedTranslate(
      language,
      categoryItems as INotPreparedTranslate[]
    );

    extra.reply_markup = this.#getCategoryButtonsKeyboardMarkup(
      language,
      false,
      preparedTranslate,
      temporaryUserId
    );

    return { text, extra };
  };

  #getCategoryButtonsKeyboardMarkup = (
    language: languageTypes,
    isCategory: boolean,
    listTranslate: IPreparedTranslate[],
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        ...listTranslate.map(it => [
          {
            text: it.translate,
            callback_data: `${
              isCategory ? 'category' : 'category_item'
            }-${temporaryUserId}:${it.id}`
          } as IInlineKeyboardButton
        ]),
        !isCategory && [
          {
            text: this.messages[language].DEFAULT_BUTTON.BACK,
            callback_data: `back-${temporaryUserId}:${ETelegramBackButtonType.CATEGORY}`
          }
        ]
      ].filter(Boolean) as IInlineKeyboardButton[][]
    };
  };
}
