import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';
import { ITelegramMessageInput } from './interface';
import { ETelegramMessageType } from '@db/tables';
import { arrayValuesToType } from '@custom-types/array-values.type';

export const telegramMessageInputFields: Array<keyof ITelegramMessageInput> = [
  'messageId',
  'chatId',
  'userId',
  'temporaryUserId',
  'telegramMessageType'
];

export class TelegramMessageValidate extends ValidationDefault {
  save = (payload: ITelegramMessageInput): ITelegramMessageInput => {
    this.#messageId(payload.messageId);
    this.#chatId(payload.chatId);
    this.#userId(payload.userId);
    this.#temporaryUserId(payload.temporaryUserId);
    this.#telegramMessageType(payload.telegramMessageType);

    return this.pick<ITelegramMessageInput>(
      payload,
      telegramMessageInputFields
    );
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

  #chatId = (chatId: string) => {
    if (chatId === undefined) {
      throw new ValidateError(`Payload atribute: [chatId] doesn't exist!`);
    }

    if (!_.isInteger(+chatId)) {
      throw new ValidateError(
        `Payload atribute: [chatId] type isn't equal to number!`
      );
    }
  };

  #messageId = (messageId: string) => {
    if (messageId === undefined) {
      throw new ValidateError(`Payload atribute: [messageId] doesn't exist!`);
    }

    if (!_.isInteger(+messageId)) {
      throw new ValidateError(
        `Payload atribute: [messageId] type isn't equal to number!`
      );
    }
  };

  #temporaryUserId = (temporaryUserId: number) => {
    if (temporaryUserId === undefined) {
      throw new ValidateError(
        `Payload atribute: [temporaryUserId] doesn't exist!`
      );
    }

    if (!_.isInteger(temporaryUserId)) {
      throw new ValidateError(
        `Payload atribute: [temporaryUserId] type isn't equal to number!`
      );
    }
  };

  #telegramMessageType = (
    telegramMessageType: arrayValuesToType<typeof ETelegramMessageType.values>
  ) => {
    if (telegramMessageType === undefined) {
      throw new ValidateError(
        `Payload atribute: [telegramMessageType] doesn't exist!`
      );
    }

    if (!ETelegramMessageType.values.includes(telegramMessageType)) {
      throw new ValidateError(
        `Payload atribute: [telegramMessageType] is not included in the existing list!`
      );
    }
  };
}
