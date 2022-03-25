import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';
import { ITemporaryUserInput } from './interface';
import {
  EEnglishLevelsType,
  EUserRole,
  EWorkExperienceInMonthsType,
  IEmployer,
  IWorker
} from '@db/tables';
import { arrayValuesToType } from '@custom-types/array-values.type';

export const temporaryUserInputFields: Array<keyof ITemporaryUserInput> = [
  'isReadyToSave',
  'telegramUserId',
  'user',
  'userRole'
];

export class TemporaryUserValidate extends ValidationDefault {
  save = (payload: ITemporaryUserInput): ITemporaryUserInput => {
    this.#telegramUserId(payload.telegramUserId);
    this.#isReadyToSave(payload.isReadyToSave);
    this.#userRole(payload.user.type);
    this.#userRole(payload.userRole);
    this.#isWorker(payload.user as IWorker);
    this.#isEmployer(payload.user as IEmployer);

    return this.pick<ITemporaryUserInput>(payload, temporaryUserInputFields);
  };

  #telegramUserId = (telegramUserId: number) => {
    if (telegramUserId === undefined) {
      throw new ValidateError(
        `Payload atribute: [telegramUserId] doesn't exist!`
      );
    }

    if (!_.isInteger(+telegramUserId)) {
      throw new ValidateError(
        `Payload atribute: [telegramUserId] type isn't equal to number!`
      );
    }
  };

  #isReadyToSave = (isReadyToSave: boolean) => {
    if (isReadyToSave === undefined) {
      throw new ValidateError(
        `Payload atribute: [isReadyToSave] doesn't exist!`
      );
    }

    if (!_.isBoolean(isReadyToSave)) {
      throw new ValidateError(
        `Payload atribute: [isReadyToSave] type isn't equal to boolean!`
      );
    }
  };

  #userRole = (roleType: arrayValuesToType<typeof EUserRole.values>) => {
    if (roleType === undefined) {
      throw new ValidateError(`Payload atribute: [userRole] doesn't exist!`);
    }

    if (!EUserRole.values.includes(roleType)) {
      throw new ValidateError(
        `Payload atribute: [userRole] is not included in the existing list!`
      );
    }
  };

  #position = (position?: string) => {
    if (position === undefined) {
      return;
    }

    if (!_.isString(position)) {
      throw new ValidateError(
        `Payload atribute: [position] type isn't equal to string!`
      );
    }
  };

  #isWorker = (worker: IWorker) => {
    if (worker.type !== 'worker') {
      return;
    }

    this.#position(worker.position);
    this.#categoruItemId(worker.categoryItemId);
    this.#workExperience(worker.workExperience);
    this.#expectedSalary(worker.expectedSalary);
    this.#englishLevel(worker.englishLevel);
    this.#workExperienceDetails(worker.workExperienceDetails);
    this.#skillsToWorkers(worker.skillsToWorkers);
    this.#employmentOptions(worker.employmentOptions);
    this.#cities(worker.cities);
  };

  #categoruItemId = (categoruItemId?: number) => {
    if (categoruItemId === undefined) {
      return;
    }

    if (!_.isInteger(+categoruItemId)) {
      throw new ValidateError(
        `Payload atribute: [categoruItemId] type isn't equal to number!`
      );
    }
  };

  #workExperience = (
    workExperience?: arrayValuesToType<
      typeof EWorkExperienceInMonthsType.values
    >
  ) => {
    if (workExperience === undefined) {
      return;
    }

    if (!EWorkExperienceInMonthsType.values.includes(workExperience)) {
      throw new ValidateError(
        `Payload atribute: [workExperience] is not included in the existing list!`
      );
    }
  };

  #expectedSalary = (expectedSalary?: number) => {
    if (expectedSalary === undefined) {
      return;
    }

    if (!_.isInteger(+expectedSalary)) {
      throw new ValidateError(
        `Payload atribute: [expectedSalary] type isn't equal to number!`
      );
    }
  };

  #englishLevel = (
    englishLevel?: arrayValuesToType<typeof EEnglishLevelsType.values>
  ) => {
    if (englishLevel === undefined) {
      return;
    }

    if (!EEnglishLevelsType.values.includes(englishLevel)) {
      throw new ValidateError(
        `Payload atribute: [englishLevel] is not included in the existing list!`
      );
    }
  };

  #workExperienceDetails = (workExperienceDetails?: string) => {
    if (workExperienceDetails === undefined) {
      return;
    }

    if (!_.isString(workExperienceDetails)) {
      throw new ValidateError(
        `Payload atribute: [workExperienceDetails] type isn't equal to string!`
      );
    }
  };

  #skillsToWorkers = (skillsToWorkers?: number[]) => {
    if (skillsToWorkers === undefined) {
      return;
    }

    skillsToWorkers.forEach(it => {
      if (!_.isInteger(it))
        throw new ValidateError(
          `Payload atribute: [skillsToWorkers.item] type isn't equal to number!`
        );
    });
  };

  #employmentOptions = (employmentOptions?: number[]) => {
    if (employmentOptions === undefined) {
      return;
    }

    employmentOptions.forEach(it => {
      if (!_.isInteger(it))
        throw new ValidateError(
          `Payload atribute: [employmentOptions.item] type isn't equal to number!`
        );
    });
  };

  #cities = (cities?: number[]) => {
    if (cities === undefined) {
      return;
    }

    cities.forEach(it => {
      if (!_.isInteger(it))
        throw new ValidateError(
          `Payload atribute: [cities.item] type isn't equal to number!`
        );
    });
  };

  #isEmployer = (employer: IEmployer) => {
    if (employer.type !== 'employer') {
      return;
    }

    this.#position(employer.position);
    this.#name(employer.name);
    this.#company(employer.company);
    this.#isUsesRootTelegramAcc(employer.isUsesRootTelegramAcc);
    this.#extraTelegramAcc(employer.extraTelegramAcc);
    this.#phone(employer.phone);
  };

  #name = (name?: string) => {
    if (name === undefined) {
      return;
    }

    if (!_.isString(name)) {
      throw new ValidateError(
        `Payload atribute: [name] type isn't equal to string!`
      );
    }
  };

  #company = (company?: string) => {
    if (company === undefined) {
      return;
    }

    if (!_.isString(company)) {
      throw new ValidateError(
        `Payload atribute: [company] type isn't equal to string!`
      );
    }
  };

  #isUsesRootTelegramAcc = (isUsesRootTelegramAcc?: boolean) => {
    if (isUsesRootTelegramAcc === undefined) {
      return;
    }

    if (!_.isBoolean(isUsesRootTelegramAcc)) {
      throw new ValidateError(
        `Payload atribute: [isUsesRootTelegramAcc] type isn't equal to boolean!`
      );
    }
  };

  #extraTelegramAcc = (extraTelegramAcc?: string) => {
    if (extraTelegramAcc === undefined) {
      return;
    }

    if (!_.isString(extraTelegramAcc)) {
      throw new ValidateError(
        `Payload atribute: [extraTelegramAcc] type isn't equal to string!`
      );
    }
  };

  #phone = (phone?: string) => {
    if (phone === undefined) {
      return;
    }

    if (!_.isString(phone)) {
      throw new ValidateError(
        `Payload atribute: [phone] type isn't equal to string!`
      );
    }
  };
}
