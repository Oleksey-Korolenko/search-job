import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole } from '@db/tables';
import ETelegramBackButtonType from '../enum/back-button-type.enum';
import ETelegramEditButtonType from '../enum/edit-button-type.enum';
import {
  IEmployerFinally,
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse,
  IWorkerFinally
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';
import TelegramExperienceView from './telegram-experience.view';

export default class TelegramSummaryView extends TelegramCommonView {
  #experienceView: TelegramExperienceView;

  constructor() {
    super();
    this.#experienceView = new TelegramExperienceView();
  }

  public selectWorkerSummary = (
    language: languageTypes,
    worker: IWorkerFinally,
    temporaryUserId: number,
    isEdit: boolean
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].WORKER.TITLE, {
      name: worker.name
    });

    const preparedCategoryTranslate = this.preparedTranslate(language, [
      worker.categoryItem
    ] as INotPreparedTranslate[]);

    text += this.preparedText(this.messages[language].WORKER.CATEGORY, {
      category: preparedCategoryTranslate[0].translate,
      position: worker.position
    });

    const experience = this.#experienceView.experienceTranslate(
      language,
      worker.workExperience
    );

    text += this.preparedText(this.messages[language].WORKER.EXPERIENCE, {
      experience
    });

    text += this.preparedText(this.messages[language].WORKER.SALARY, {
      salary: worker.expectedSalary
    });

    text += this.preparedText(this.messages[language].WORKER.ENGLISH, {
      english: worker.englishLevel
    });

    text += this.preparedText(this.messages[language].WORKER.SKILLS, {});

    worker.skills.forEach(
      it =>
        (text += this.preparedText(
          this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
          {
            item: it
          }
        ))
    );

    const preparedEmploymentOptionsTranslate = this.preparedTranslate(
      language,
      worker.employmentOptions as INotPreparedTranslate[]
    );

    text += this.preparedText(
      this.messages[language].WORKER.EMPLOYMENT_OPTIONS,
      {}
    );

    preparedEmploymentOptionsTranslate.forEach(
      it =>
        (text += this.preparedText(
          this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
          {
            item: it.translate
          }
        ))
    );

    text += this.preparedText(
      this.messages[language].WORKER.EXPERIENCE_DETAILS,
      {}
    );

    text += this.preparedText(
      this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
      {
        item: worker.workExperienceDetails
      }
    );

    if (isEdit) {
      extra.reply_markup = this.#getFinallyEditButtonKeyboardMarkup(
        language,
        'worker',
        temporaryUserId
      );
    } else {
      extra.reply_markup = this.#getFinallyButtonKeyboardMarkup(
        language,
        'worker',
        temporaryUserId
      );
    }

    return { text, extra };
  };

  public selectEmployerSummary = (
    language: languageTypes,
    employer: IEmployerFinally,
    temporaryUserId: number,
    isEdit: boolean
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].EMPLOYER.TITLE, {
      name: employer.name
    });

    text += this.preparedText(this.messages[language].EMPLOYER.COMPANY, {
      company: employer.company,
      position: employer.position
    });

    text += this.preparedText(this.messages[language].EMPLOYER.PHONE, {
      phone: employer.phone
    });

    if (isEdit) {
      extra.reply_markup = this.#getFinallyEditButtonKeyboardMarkup(
        language,
        'employer',
        temporaryUserId
      );
    } else {
      extra.reply_markup = this.#getFinallyButtonKeyboardMarkup(
        language,
        'employer',
        temporaryUserId
      );
    }

    return { text, extra };
  };

  #getFinallyButtonKeyboardMarkup = (
    language: languageTypes,
    userType: arrayValuesToType<typeof EUserRole.values>,
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.EDIT,
            callback_data: `edit_finally-${temporaryUserId}:${userType}`
          }
        ],
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.SAVE,
            callback_data: `save_finally-${temporaryUserId}:${userType}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };

  #getFinallyEditButtonKeyboardMarkup = (
    language: languageTypes,
    userType: arrayValuesToType<typeof EUserRole.values>,
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    const inlineKeyboardMarkup = {
      inline_keyboard: []
    } as IInlineKeyboardMarkup;

    if (userType === 'employer') {
      const buttons = this.messages[language].EMPLOYER.BUTTON;

      inlineKeyboardMarkup.inline_keyboard.push(
        [
          {
            text: buttons.NAME,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.NAME}`
          }
        ],
        [
          {
            text: buttons.COMPANY,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.COMPANY}`
          }
        ],
        [
          {
            text: buttons.POSITION,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.POSITION}`
          }
        ],
        [
          {
            text: buttons.PHONE,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.PHONE}`
          }
        ]
      );
    }

    if (userType === 'worker') {
      const buttons = this.messages[language].WORKER.BUTTON;

      inlineKeyboardMarkup.inline_keyboard.push(
        [
          {
            text: buttons.NAME,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.NAME}`
          }
        ],
        [
          {
            text: buttons.CATEGORY,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.CATEGORY}`
          }
        ],
        [
          {
            text: buttons.POSITION,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.POSITION}`
          }
        ],
        [
          {
            text: buttons.EXPERIENCE,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.EXPERIENCE}`
          }
        ],
        [
          {
            text: buttons.SALARY,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.SALARY}`
          }
        ],
        [
          {
            text: buttons.ENGLISH,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.ENGLISH_LEVEL}`
          }
        ],
        [
          {
            text: buttons.SKILLS,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.SKILL}`
          }
        ],
        [
          {
            text: buttons.EMPLOYMENT_OPTIONS,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.EMPLOYMENT_OPTIONS}`
          }
        ],
        [
          {
            text: buttons.EXPERIENCE_DETAILS,
            callback_data: `edit-${temporaryUserId}:${ETelegramEditButtonType.EXPERIENCE_DETAILS}`
          }
        ]
      );
    }

    inlineKeyboardMarkup.inline_keyboard.push([
      {
        text: this.messages[language].DEFAULT_BUTTON.BACK,
        callback_data: `back-${temporaryUserId}:${ETelegramBackButtonType.SUMMARY}`
      }
    ]);

    return inlineKeyboardMarkup;
  };

  public saveSummary = (
    language: languageTypes,
    role: arrayValuesToType<typeof EUserRole.values>
  ): string => {
    let text = '';

    if (role === 'worker') {
      text += this.preparedText(this.messages[language].WORKER.SAVE, {});
    }
    if (role === 'employer') {
      text += this.preparedText(this.messages[language].EMPLOYER.SAVE, {});
    }

    return text;
  };
}
