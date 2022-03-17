import { CategoryItemType, CategoryType } from '@db/tables';
import { IArgsForPreparedText } from '.';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  IPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from './interface';
import messages, { languageTypes } from './messages';

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
            callback_data: `lang_type:en`
          }
        ],
        [
          {
            text: messages.ua.START.BUTTON.TYPE_LANGUAGE,
            callback_data: `lang_type:ua`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  public selectRole = (k: languageTypes): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[k].SELECT_ROLE.DEFAULT, {});

    extra.reply_markup = this.#getRoleButtonsKeyboardMarkup(k);

    return { text, extra };
  };

  #getRoleButtonsKeyboardMarkup = (k: languageTypes): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages[k].SELECT_ROLE.BUTTON.WORKER,
            callback_data: `role_type:worker`
          }
        ],
        [
          {
            text: messages[k].SELECT_ROLE.BUTTON.EMPLOYER,
            callback_data: `role_type:employer`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  public selectCategory = (
    language: languageTypes,
    categories: CategoryType[]
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].CATEGORY.DEFAULT, {});

    const preparedTranslate = this.#preparedTranslate(
      language,
      categories as INotPreparedTranslate[]
    );

    extra.reply_markup = this.#getCategoryButtonsKeyboardMarkup(
      language,
      true,
      preparedTranslate
    );

    return { text, extra };
  };

  public selectCategoryItem = (
    language: languageTypes,
    category: CategoryType,
    categoryItems: CategoryItemType[]
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].CATEGORY.ITEM, {
      category: category.name
    });

    const preparedTranslate = this.#preparedTranslate(
      language,
      categoryItems as INotPreparedTranslate[]
    );

    extra.reply_markup = this.#getCategoryButtonsKeyboardMarkup(
      language,
      false,
      preparedTranslate
    );

    return { text, extra };
  };

  #getCategoryButtonsKeyboardMarkup = (
    language: languageTypes,
    isCategory: boolean,
    listTranslate: IPreparedTranslate[]
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        ...listTranslate.map(it => [
          {
            text: it.translate,
            callback_data: `${isCategory ? 'category' : 'category_item'}:${
              it.id
            }`
          } as IInlineKeyboardButton
        ]),
        !isCategory && [
          {
            text: messages[language].CATEGORY.BUTTON.BACK,
            callback_data: 'back'
          }
        ]
      ].filter(Boolean) as IInlineKeyboardButton[][]
    };
  };

  #preparedTranslate = (
    language: languageTypes,
    itemList: INotPreparedTranslate[]
  ): IPreparedTranslate[] => {
    switch (language) {
      case 'ua': {
        return itemList.map(it => ({
          id: it.id,
          translate: it.name
        }));
      }
      default: {
        return itemList.map(it => ({
          id: it.id,
          translate: it.translate[language]
        }));
      }
    }
  };

  #preparedText = (text: string, args: IArgsForPreparedText): string => {
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
}
