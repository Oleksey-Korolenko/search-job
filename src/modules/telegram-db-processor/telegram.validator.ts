import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';
import { ITelegramInput } from './interface';
import { languageArray, languageTypes } from '@modules/telegram/messages';

const telegramInputFields: Array<keyof ITelegramInput> = [
  'username',
  'language',
  'userId'
];

class TelegramValidate extends ValidationDefault {
  save = (payload: ITelegramInput): ITelegramInput => {
    this.#username(payload.username);
    this.#language(payload.language);
    this.#chatId(payload.userId);

    return this.pick<ITelegramInput>(payload, telegramInputFields);
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

  #chatId = (chatId: number) => {
    if (chatId === undefined) {
      throw new ValidateError(`Payload atribute: [userId] doesn't exist!`);
    }

    if (!_.isInteger(+chatId)) {
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

export default {
  telegramValidate: new TelegramValidate(),
  TelegramValidate,
  telegramFields: telegramInputFields
};
