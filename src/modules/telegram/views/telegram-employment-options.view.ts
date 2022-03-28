import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import {
  INotPreparedTranslate,
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramEmploymentOptionsView extends TelegramCommonView {
  public selectEmploymentOptions = (
    language: languageTypes,
    temporaryUserId: number,
    employmentOptions: INotPreparedTranslate[],
    existEmploymentOptions: INotPreparedTranslate[]
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(
      this.messages[language].EMPLOYMENT_OPTIONS.DEFAULT,
      {}
    );

    if (existEmploymentOptions.length > 0) {
      const preparedExistEmploymentOptionsTranslate = this.preparedTranslate(
        language,
        existEmploymentOptions
      );

      text += this.preparedText(
        this.messages[language].EMPLOYMENT_OPTIONS.EXIST_ITEMS,
        {}
      );

      preparedExistEmploymentOptionsTranslate.forEach(
        it =>
          (text += this.preparedText(
            this.messages[language].DEFAULT_MESSAGE.LIST_ITEM,
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

    extra.reply_markup = this.getCheckboxButtonsKeyboardMarkup(
      language,
      temporaryUserId,
      preparedEmploymentOptionsTranslate,
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      existEmploymentOptions.length === 0 ? false : true
    );

    return { text, extra };
  };
}
