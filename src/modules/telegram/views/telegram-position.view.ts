import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole } from '@db/tables';
import {
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramPositionView extends TelegramCommonView {
  public selectPosition = (
    language: languageTypes,
    role: arrayValuesToType<typeof EUserRole.values>
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    if (role === 'employer') {
      text += this.preparedText(this.messages[language].POSITION.EMPLOYER, {});
    }

    if (role === 'worker') {
      text += this.preparedText(this.messages[language].POSITION.WORKER, {});
    }

    return { text, extra };
  };
}
