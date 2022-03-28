import ETelegramConfirmButtonType from '../enum/confirm-button-type.enum';
import {
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramSalaryView extends TelegramCommonView {
  public selectSalary = (
    language: languageTypes,
    isError: boolean,
    operationType?: ETelegramConfirmButtonType
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    if (isError) {
      text += this.preparedText(this.messages[language].SALARY.ERROR, {});

      extra.reply_markup = this.getYesOrNoButtonKeyboardMarkup(
        language,
        operationType
      );
    } else {
      text += this.preparedText(this.messages[language].SALARY.DEFAULT, {});
    }

    return { text, extra };
  };
}
