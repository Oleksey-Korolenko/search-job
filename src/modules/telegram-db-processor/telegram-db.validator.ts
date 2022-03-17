import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';
import { ITelegramDBInput } from './interface';
import { languageArray, languageTypes } from '@modules/telegram/messages';

export const telegramDBInputFields: Array<keyof ITelegramDBInput> = [
  'username',
  'language',
  'userId'
];

export class TelegramDBValidate extends ValidationDefault {
  save = (payload: ITelegramDBInput): ITelegramDBInput => {
    this.#username(payload.username);
    this.#language(payload.language);
    this.#userId(payload.userId);

    return this.pick<ITelegramDBInput>(payload, telegramDBInputFields);
  };

  #language = (language: languageTypes) => {
    if (language === undefined) {
      throw new ValidateError(`Payload atribute: [language] doesn't exist!`);
    }

    if (!languageArray.includes(language)) {
      throw new ValidateError(
        `Payload atribute: [language] is not included in the existing list!`
      );
    }
  };

  #userId = (userId: string) => {
    if (userId === undefined) {
      throw new ValidateError(`Payload atribute: [userId] doesn't exist!`);
    }

    if (!_.isInteger(+userId)) {
      throw new ValidateError(
        `Payload atribute: [userId] type isn't equal to number!`
      );
    }
  };

  #username = (name: string) => {
    if (name === undefined) {
      throw new ValidateError(`Payload atribute: [name] doesn't exist!`);
    }

    if (!_.isString(name)) {
      throw new ValidateError(
        `Payload atribute: [name] type isn't equal to string!`
      );
    }
  };
}
