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
}
