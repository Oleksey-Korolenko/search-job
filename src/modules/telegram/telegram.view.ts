import { arrayValuesToType } from '@custom-types/array-values.type';
import {
  CategoryItemType,
  CategoryType,
  EWorkExperienceInMonthsType
} from '@db/tables';
import { IArgsForPreparedText } from '.';
import ETelegramCheckboxButtonType from './enum/checkbox-button-type.enum';
import ETelegramConfirmButtonType from './enum/confirm-button-type.enum';
import ETelegramEditButtonType from './enum/edit-button-type.enum';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  IPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse,
  IWorkerFinally
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

    text += this.#preparedText(messages[language].CATEGORY.ITEM, {
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
        ...EWorkExperienceInMonthsType.values.map(it => [
          {
            text: this.#experienceTranslate(language, it),
            callback_data: `experience-${temporaryUserId}:${it}`
          }
        ])
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

  // english level section start

  public selectEnglishLevel = (
    language: languageTypes,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].ENGLISH_LEVEL.DEFAULT, {});

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
            text: messages[language].ENGLISH_LEVEL.BUTTON.NO_ENGLISH,
            callback_data: `english_level-${temporaryUserId}:0`
          }
        ],
        [
          {
            text: messages[language].ENGLISH_LEVEL.BUTTON.A1,
            callback_data: `english_level-${temporaryUserId}:1`
          }
        ],
        [
          {
            text: messages[language].ENGLISH_LEVEL.BUTTON.A2,
            callback_data: `english_level-${temporaryUserId}:2`
          }
        ],
        [
          {
            text: messages[language].ENGLISH_LEVEL.BUTTON.B1,
            callback_data: `english_level-${temporaryUserId}:3`
          }
        ],
        [
          {
            text: messages[language].ENGLISH_LEVEL.BUTTON.B2,
            callback_data: `english_level-${temporaryUserId}:4`
          }
        ],
        [
          {
            text: messages[language].ENGLISH_LEVEL.BUTTON.C1,
            callback_data: `english_level-${temporaryUserId}:5`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  // english level section end

  // city section start

  public selectCity = (
    language: languageTypes,
    temporaryUserId: number,
    cities: INotPreparedTranslate[],
    existCities: INotPreparedTranslate[]
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].CITIES.DEFAULT, {});

    if (existCities.length > 0) {
      const preparedExistCitiesTranslate = this.preparedTranslate(
        language,
        existCities
      );

      text += this.#preparedText(messages[language].CITIES.EXIST_CITIES, {});

      preparedExistCitiesTranslate.forEach(
        it =>
          (text += this.#preparedText(
            messages[language].DEFAULT_MESSAGE.LIST_ITEM,
            {
              item: it.translate
            }
          ))
      );
    }

    const preparedCitiesTranslate = this.preparedTranslate(language, cities);

    extra.reply_markup = this.#getCheckboxButtonsKeyboardMarkup(
      language,
      temporaryUserId,
      preparedCitiesTranslate,
      ETelegramCheckboxButtonType.CITY,
      existCities.length === 0 ? false : true
    );

    return { text, extra };
  };

  // city section end

  // skills section start

  public selectSkills = (
    language: languageTypes,
    temporaryUserId: number,
    skills: INotPreparedTranslate[],
    existSkills: INotPreparedTranslate[],
    categoryItem: INotPreparedTranslate
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    const preparedCaegoryItemTranslate = this.preparedTranslate(language, [
      categoryItem
    ]);

    text += this.#preparedText(messages[language].SKILLS.DEFAULT, {
      category_item: preparedCaegoryItemTranslate[0].translate
    });

    if (existSkills.length > 0) {
      const preparedExistSkillsTranslate = this.preparedTranslate(
        language,
        existSkills
      );

      text += this.#preparedText(messages[language].SKILLS.EXIST_SKILLS, {});

      preparedExistSkillsTranslate.forEach(
        it =>
          (text += this.#preparedText(
            messages[language].DEFAULT_MESSAGE.LIST_ITEM,
            {
              item: it.translate
            }
          ))
      );
    }

    const preparedSkillsTranslate = this.preparedTranslate(language, skills);

    extra.reply_markup = this.#getCheckboxButtonsKeyboardMarkup(
      language,
      temporaryUserId,
      preparedSkillsTranslate,
      ETelegramCheckboxButtonType.SKILL,
      existSkills.length === 0 ? false : true
    );

    return { text, extra };
  };

  // skills section end

  // employment options section start

  public selectEmploymentOptions = (
    language: languageTypes,
    temporaryUserId: number,
    employmentOptions: INotPreparedTranslate[],
    existEmploymentOptions: INotPreparedTranslate[]
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(
      messages[language].EMPLOYMENT_OPTIONS.DEFAULT,
      {}
    );

    if (existEmploymentOptions.length > 0) {
      const preparedExistEmploymentOptionsTranslate = this.preparedTranslate(
        language,
        existEmploymentOptions
      );

      text += this.#preparedText(
        messages[language].EMPLOYMENT_OPTIONS.EXIST_SKILLS,
        {}
      );

      preparedExistEmploymentOptionsTranslate.forEach(
        it =>
          (text += this.#preparedText(
            messages[language].DEFAULT_MESSAGE.LIST_ITEM,
            {
              item: it.translate
            }
          ))
      );
    }

    const preparedEmploymentOptionsTranslate = this.preparedTranslate(
      language,
      employmentOptions
    );

    extra.reply_markup = this.#getCheckboxButtonsKeyboardMarkup(
      language,
      temporaryUserId,
      preparedEmploymentOptionsTranslate,
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      existEmploymentOptions.length === 0 ? false : true
    );

    return { text, extra };
  };

  // employment options section end

  // experience details section start

  public selectExperienceDetails = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(
      messages[language].DESCRIPTION_TO_EXPERIENCE.DEFAULT,
      {}
    );

    return { text, extra };
  };

  // experience details section end

  // full name section start

  public selectFullName = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.#preparedText(messages[language].NAME.DEFAULT, {});

    return { text, extra };
  };

  // full name section end

  // final worker section start

  public selectFinallyWorker = (
    language: languageTypes,
    worker: IWorkerFinally,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    const preparedCategoryTranslate = this.preparedTranslate(language, [
      worker.categoryItem
    ] as INotPreparedTranslate[]);

    text += this.#preparedText(messages[language].WORKER.CATEGORY, {
      category: preparedCategoryTranslate[0].translate,
      position: worker.position
    });

    const experience = this.#experienceTranslate(
      language,
      worker.workExperience
    );

    text += this.#preparedText(messages[language].WORKER.EXPERIENCE, {
      experience
    });

    text += this.#preparedText(messages[language].WORKER.SALARY, {
      salary: worker.expectedSalary
    });

    text += this.#preparedText(messages[language].WORKER.ENGLISH, {
      english: worker.englishLevel
    });

    const preparedSkillsTranslate = this.preparedTranslate(
      language,
      worker.skillsToWorkers as INotPreparedTranslate[]
    );

    text += this.#preparedText(messages[language].WORKER.SKILLS, {});

    preparedSkillsTranslate.forEach(
      it =>
        (text += this.#preparedText(
          messages[language].DEFAULT_MESSAGE.LIST_ITEM,
          {
            item: it.translate
          }
        ))
    );

    const preparedCitiesTranslate = this.preparedTranslate(
      language,
      worker.cities as INotPreparedTranslate[]
    );

    text += this.#preparedText(messages[language].WORKER.CITIES, {});

    preparedCitiesTranslate.forEach(
      it =>
        (text += this.#preparedText(
          messages[language].DEFAULT_MESSAGE.LIST_ITEM,
          {
            item: it.translate
          }
        ))
    );

    const preparedEmploymentOptionsTranslate = this.preparedTranslate(
      language,
      worker.employmentOptions as INotPreparedTranslate[]
    );

    text += this.#preparedText(
      messages[language].WORKER.EMPLOYMENT_OPTIONS,
      {}
    );

    preparedEmploymentOptionsTranslate.forEach(
      it =>
        (text += this.#preparedText(
          messages[language].DEFAULT_MESSAGE.LIST_ITEM,
          {
            item: it.translate
          }
        ))
    );

    text += this.#preparedText(messages[language].WORKER.EXPERIENCE_DETAILS, {
      details: worker.workExperienceDetails
    });

    extra.reply_markup = this.#getFinallyButtonKeyboardMarkup(
      language,
      'worker',
      temporaryUserId
    );

    return { text, extra };
  };

  #getFinallyButtonKeyboardMarkup = (
    language: languageTypes,
    userType: 'worker' | 'employer',
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: messages[language].DEFAULT_BUTTON.EDIT,
            callback_data: `edit_finaly-${temporaryUserId}:${userType}`
          }
        ],
        [
          {
            text: messages[language].DEFAULT_BUTTON.SAVE,
            callback_data: `save_finaly-${temporaryUserId}:${userType}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  // final worker section end

  // edit section start

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
      text += this.#preparedText(messages[language].DEFAULT_MESSAGE.SUCCESS, {
        item: item as string
      });
    } else {
      const preparedItemTranslate = this.preparedTranslate(
        language,
        item as INotPreparedTranslate[]
      );

      text += this.#preparedText(
        messages[language].DEFAULT_MESSAGE.SUCCESS_LIST,
        {}
      );

      preparedItemTranslate.forEach(
        it =>
          (text += this.#preparedText(
            messages[language].DEFAULT_MESSAGE.SUCCESS,
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

  #experienceTranslate = (
    language: languageTypes,
    experience: arrayValuesToType<typeof EWorkExperienceInMonthsType.values>
  ): string => {
    switch (experience) {
      case '0': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.NOTHING,
          {}
        );
      }
      case '6': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.HALF_YEAR,
          {}
        );
      }
      case '12': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.ONE_YEAR,
          {}
        );
      }
      case '18': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.ONE_AND_HALF_YEAR,
          {}
        );
      }
      case '24': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.TWO_YEARS,
          {}
        );
      }
      case '30': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.TWO_AND_HALF_YEARS,
          {}
        );
      }
      case '36': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.THREE_YEARS,
          {}
        );
      }
      case '48': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.THREE_YEARS,
          {}
        );
      }
      case '60': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.FIVE_YEARS,
          {}
        );
      }
      case '72': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.SIX_YEARS,
          {}
        );
      }
      case '84': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.SEVEN_YEARS,
          {}
        );
      }
      case '96': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.EIGHT_YEARS,
          {}
        );
      }
      case '108': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.NINE_YEARS,
          {}
        );
      }
      case '120': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.TEN_YEARS,
          {}
        );
      }
      case '-1': {
        return this.#preparedText(
          messages[language].EXPERIENSE.BUTTON.MORE_THEN_TEN_YEARS,
          {}
        );
      }
    }
  };

  preparedTranslate = (
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

  #getCheckboxButtonsKeyboardMarkup = (
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
                  text: this.#preparedText(
                    messages[language].DEFAULT_BUTTON.DELETE,
                    { item: it.translate }
                  ),
                  callback_data: `delete-${temporaryUserId}-${checkboxType}:${it.id}`
                } as IInlineKeyboardButton
              ]
            : [
                {
                  text: this.#preparedText(
                    messages[language].DEFAULT_BUTTON.ADD,
                    { item: it.translate }
                  ),
                  callback_data: `add-${temporaryUserId}-${checkboxType}:${it.id}`
                } as IInlineKeyboardButton
              ]
        ),
        isSaveButton && [
          {
            text: messages[language].DEFAULT_BUTTON.SAVE,
            callback_data: `save-${temporaryUserId}-${checkboxType}`
          }
        ]
      ].filter(Boolean) as IInlineKeyboardButton[][]
    };
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
