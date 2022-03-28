import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import {
  IInlineKeyboardButton,
  IInlineKeyboardMarkup,
  INotPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramSkillsView extends TelegramCommonView {
  public selectSkills = (
    language: languageTypes,
    temporaryUserId: number,
    existSkills: string[],
    categoryItem: INotPreparedTranslate
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    const preparedCaegoryItemTranslate = this.preparedTranslate(language, [
      categoryItem
    ]);

    text += this.preparedText(this.messages[language].SKILLS.DEFAULT, {
      category_item: preparedCaegoryItemTranslate[0].translate
    });

    text += this.preparedText(this.messages[language].SKILLS.INSTRUCTION, {});

    if (existSkills.length > 0) {
      text += this.preparedText(this.messages[language].SKILLS.EXIST_ITEMS, {});

      existSkills.forEach(
        it =>
          (text += this.preparedText(
            this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
            {
              item: it
            }
          ))
      );

      text += this.preparedText(this.messages[language].SKILLS.SAVE, {
        btn: this.messages[language].DEFAULT_BUTTON.SAVE
      });

      extra.reply_markup = this.#getSkillsButtonKeyboardMarkup(
        language,
        temporaryUserId
      );
    }

    return { text, extra };
  };

  public showEnterSkills = (
    language: languageTypes,
    existSkills: string[]
  ): string => {
    let text = '';

    text += this.preparedText(this.messages[language].SKILLS.EXIST_ITEMS, {});

    existSkills.forEach(
      it =>
        (text += this.preparedText(
          this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
          {
            item: it
          }
        ))
    );

    return text;
  };

  #getSkillsButtonKeyboardMarkup = (
    language: languageTypes,
    temporaryUserId: number
  ): IInlineKeyboardMarkup => {
    return {
      inline_keyboard: [
        [
          {
            text: this.messages[language].DEFAULT_BUTTON.SAVE,
            callback_data: `save-${temporaryUserId}-${ETelegramCheckboxButtonType.SKILL}`
          }
        ]
      ] as IInlineKeyboardButton[][]
    };
  };
}
