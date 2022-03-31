import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';

export class TelegramValidate extends ValidationDefault {
  salary = (salary: string): number => {
    if (salary === undefined) {
      throw new ValidateError(`Payload atribute: [salary] doesn't exist!`);
    }

    if (!_.isInteger(+salary)) {
      throw new ValidateError(
        `Payload atribute: [salary] type isn't equal to number!`
      );
    }

    return +salary;
  };

  phone = (phone: string): string => {
    if (phone === undefined) {
      throw new ValidateError(`Payload atribute: [phone] doesn't exist!`);
    }

    if (phone.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) === null) {
      throw new ValidateError(
        `Payload atribute: [phone] type isn't equal to phone number!`
      );
    }

    return phone;
  };
}
