import {
  CategoryItemType,
  CategoryType,
  EWorkExperienceInMonthsType
} from '@db/tables';
import { IArgsForPreparedText } from '.';
import ETelegramButtonType from './enum/button-type.enum';
import ETelegramConfirmButtonType from './enum/confirm-button-type.enum';
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
  // language section start

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

  // language section end

  // role section start

  public selectRole = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].SELECT_ROLE.DEFAULT, {});

    extra.reply_markup = this.#getRoleButtonsKeyboardMarkup(language);

    return { text, extra };
  };

  #getRoleButtonsKeyboardMarkup = (
    language: languageTypes
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages[language].SELECT_ROLE.BUTTON.WORKER,
            callback_data: `role_type:worker`
          }
        ],
        [
          {
            text: messages[language].SELECT_ROLE.BUTTON.EMPLOYER,
            callback_data: `role_type:employer`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  // role section end

  // category section start

  public selectCategory = (
    language: languageTypes,
    categories: CategoryType[],
    temporaryUserId: number
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
            text: messages[language].DEFAULT_BUTTON.BACK,
            callback_data: `back-${temporaryUserId}`
          }
        ]
      ].filter(Boolean) as IInlineKeyboardButton[][]
    };
  };

  // category section end

  // experience section start

  public selectExperience = (
    language: languageTypes,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].EXPERIENSE.DEFAULT, {});

    extra.reply_markup = this.#getExperienceButtonsKeyboardMarkup(
      language,
      temporaryUserId
    );

    return { text, extra };
  };

  #getExperienceButtonsKeyboardMarkup = (
    language: languageTypes,
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.NOTHING,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[0]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.HALF_YEAR,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[1]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.ONE_YEAR,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[2]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.ONE_AND_HALF_YEAR,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[3]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.TWO_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[4]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.TWO_AND_HALF_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[5]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.THREE_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[6]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.FOUR_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[7]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.FIVE_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[8]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.SIX_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[9]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.SEVEN_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[10]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.EIGHT_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[11]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.NINE_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[12]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.TEN_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[13]}`
          }
        ],
        [
          {
            text: messages[language].EXPERIENSE.BUTTON.MORE_THEN_TEN_YEARS,
            callback_data: `experience-${temporaryUserId}:${EWorkExperienceInMonthsType.values[14]}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  // experience section end

  // salary section start

  public selectSalary = (
    language: languageTypes,
    isError: boolean,
    operationType?: ETelegramConfirmButtonType
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    if (isError) {
      text += this.#preparedText(messages[language].SALARY.ERROR, {});

      extra.reply_markup = this.#getYesOrNoButtonKeyboardMarkup(
        language,
        operationType
      );
    } else {
      text += this.#preparedText(messages[language].SALARY.DEFAULT, {});
    }

    return { text, extra };
  };

  // salary section end

  // position section start

  public selectPosition = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].POSITION.DEFAULT, {});

    return { text, extra };
  };

  // position section end

  // edit section start

  public selectSuccess = (
    language: languageTypes,
    item: string,
    operationType: ETelegramButtonType,
    temporaryUserId?: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].SUCCESS, { item });

    extra.reply_markup = this.#getEditButtonKeyboardMarkup(
      language,
      operationType,
      temporaryUserId
    );

    return { text, extra };
  };

  #getEditButtonKeyboardMarkup = (
    language: languageTypes,
    operationType: ETelegramButtonType,
    temporaryUserId?: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages[language].DEFAULT_BUTTON.EDIT,
            callback_data: `edit${
              temporaryUserId === undefined ? '' : '-' + temporaryUserId
            }:${operationType}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  // edit section end

  // default section start

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

  #getYesOrNoButtonKeyboardMarkup = (
    language: languageTypes,
    operationType: ETelegramConfirmButtonType
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages[language].DEFAULT_BUTTON.YES,
            callback_data: `yes:${operationType}`
          }
        ],
        [
          {
            text: messages[language].DEFAULT_BUTTON.NO,
            callback_data: `no:${operationType}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
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

  // default section end
}
