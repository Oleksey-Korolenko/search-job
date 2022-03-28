import { arrayValuesToType } from '@custom-types/array-values.type';
import { EWorkExperienceInMonthsType } from '@db/tables';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramExperienceView extends TelegramCommonView {
  public selectExperience = (
    language: languageTypes,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(this.messages[language].EXPERIENSE.DEFAULT, {});

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
            text: this.experienceTranslate(language, it),
            callback_data: `experience-${temporaryUserId}:${it}`
          }
        ])
      ] as IInlineKeyboardButton[][]
    };
  };

  public experienceTranslate = (
    language: languageTypes,
    experience: arrayValuesToType<typeof EWorkExperienceInMonthsType.values>
  ): string => {
    switch (experience) {
      case '0': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.NOTHING,
          {}
        );
      }
      case '6': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.HALF_YEAR,
          {}
        );
      }
      case '12': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.ONE_YEAR,
          {}
        );
      }
      case '18': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.ONE_AND_HALF_YEAR,
          {}
        );
      }
      case '24': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.TWO_YEARS,
          {}
        );
      }
      case '30': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.TWO_AND_HALF_YEARS,
          {}
        );
      }
      case '36': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.THREE_YEARS,
          {}
        );
      }
      case '48': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.FOUR_YEARS,
          {}
        );
      }
      case '60': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.FIVE_YEARS,
          {}
        );
      }
      case '72': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.SIX_YEARS,
          {}
        );
      }
      case '84': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.SEVEN_YEARS,
          {}
        );
      }
      case '96': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.EIGHT_YEARS,
          {}
        );
      }
      case '108': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.NINE_YEARS,
          {}
        );
      }
      case '120': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.TEN_YEARS,
          {}
        );
      }
      case '-1': {
        return this.preparedText(
          this.messages[language].EXPERIENSE.BUTTON.MORE_THEN_TEN_YEARS,
          {}
        );
      }
    }
  };
}
