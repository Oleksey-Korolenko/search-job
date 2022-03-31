import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';
import { IEmployerInput } from './interface';

export const employerInputFields: Array<keyof IEmployerInput> = [
  'name',
  'position',
  'company',
  'phone',
  'telegramUserId'
];

export class EmployerValidate extends ValidationDefault {
  save = (payload: IEmployerInput): IEmployerInput => {
    this.#position(payload.position);
    this.#name(payload.name);
    this.#company(payload.company);
    this.#phone(payload.phone);
    this.#telegramUserId(payload.telegramUserId);

    return this.pick<IEmployerInput>(payload, employerInputFields);
  };

  #name = (name: string) => {
    if (name === undefined) {
      throw new ValidateError(`Payload atribute: [name] doesn't exist!`);
    }

    if (!_.isString(name)) {
      throw new ValidateError(
        `Payload atribute: [name] type isn't equal to string!`
      );
    }
  };

  #position = (position: string) => {
    if (position === undefined) {
      throw new ValidateError(`Payload atribute: [position] doesn't exist!`);
    }

    if (!_.isString(position)) {
      throw new ValidateError(
        `Payload atribute: [position] type isn't equal to string!`
      );
    }
  };

  #company = (company: string) => {
    if (company === undefined) {
      throw new ValidateError(`Payload atribute: [company] doesn't exist!`);
    }

    if (!_.isString(company)) {
      throw new ValidateError(
        `Payload atribute: [company] type isn't equal to string!`
      );
    }
  };

  #phone = (phone: string) => {
    if (phone === undefined) {
      throw new ValidateError(`Payload atribute: [phone] doesn't exist!`);
    }

    if (!_.isString(phone)) {
      throw new ValidateError(
        `Payload atribute: [phone] type isn't equal to string!`
      );
    }
  };

  #telegramUserId = (telegramUserId: number) => {
    if (telegramUserId === undefined) {
      throw new ValidateError(
        `Payload atribute: [telegramUserId] doesn't exist!`
      );
    }

    if (!_.isInteger(telegramUserId)) {
      throw new ValidateError(
        `Payload atribute: [telegramUserId] type isn't equal to number!`
      );
    }
  };
}
