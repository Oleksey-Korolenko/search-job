import {
  ITelegramTextFormatterExtra,
  ITelegramTextFormatterResponse
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonView from './telegram-common.view';

export default class TelegramExperienceDetailsView extends TelegramCommonView {
  public selectExperienceDetails = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => {
    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    text += this.preparedText(
      this.messages[language].DESCRIPTION_TO_EXPERIENCE.DEFAULT,
      {}
    );

    return { text, extra };
  };
}
