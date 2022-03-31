import ValidateError from '@custom-types/validate-error.type';
import _ from 'lodash';
import { ValidationDefault } from '@custom-types/validation-default.type';
import { IWorkerInput } from './interface';
import { EEnglishLevelsType, EWorkExperienceInMonthsType } from '@db/tables';
import { arrayValuesToType } from '@custom-types/array-values.type';

export const workerInputFields: Array<keyof IWorkerInput> = [
  'name',
  'categoryItemId',
  'workExperience',
  'expectedSalary',
  'position',
  'englishLevel',
  'skills',
  'workExperienceDetails',
  'telegramUserId'
];

export class WorkerValidate extends ValidationDefault {
  save = (payload: IWorkerInput): IWorkerInput => {
    this.#name(payload.name);
    this.#categoryItemId(payload.categoryItemId);
    this.#workExperience(payload.workExperience);
    this.#expectedSalary(payload.expectedSalary);
    this.#position(payload.position);
    this.#englishLevel(payload.englishLevel);
    this.#skills(payload.skills);
    this.#workExperienceDetails(payload.workExperienceDetails);
    this.#telegramUserId(payload.telegramUserId);

    return this.pick<IWorkerInput>(payload, workerInputFields);
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

  #categoryItemId = (categoryItemId: number) => {
    if (categoryItemId === undefined) {
      throw new ValidateError(
        `Payload atribute: [categoryItemId] doesn't exist!`
      );
    }

    if (!_.isInteger(categoryItemId)) {
      throw new ValidateError(
        `Payload atribute: [categoryItemId] type isn't equal to number!`
      );
    }
  };

  #workExperience = (
    workExperience: arrayValuesToType<typeof EWorkExperienceInMonthsType.values>
  ) => {
    if (workExperience === undefined) {
      throw new ValidateError(
        `Payload atribute: [workExperience] doesn't exist!`
      );
    }

    if (!EWorkExperienceInMonthsType.values.includes(workExperience)) {
      throw new ValidateError(
        `Payload atribute: [workExperience] is not included in the existing list!`
      );
    }
  };

  #expectedSalary = (expectedSalary: number) => {
    if (expectedSalary === undefined) {
      throw new ValidateError(
        `Payload atribute: [expectedSalary] doesn't exist!`
      );
    }

    if (!_.isInteger(expectedSalary)) {
      throw new ValidateError(
        `Payload atribute: [expectedSalary] type isn't equal to number!`
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

  #englishLevel = (
    englishLevel: arrayValuesToType<typeof EEnglishLevelsType.values>
  ) => {
    if (englishLevel === undefined) {
      throw new ValidateError(
        `Payload atribute: [englishLevel] doesn't exist!`
      );
    }

    if (!EEnglishLevelsType.values.includes(englishLevel)) {
      throw new ValidateError(
        `Payload atribute: [englishLevel] is not included in the existing list!`
      );
    }
  };

  #skills = (skills: string[]) => {
    if (skills === undefined) {
      throw new ValidateError(`Payload atribute: [skills] doesn't exist!`);
    }

    skills.forEach(it => {
      if (!_.isString(it)) {
        throw new ValidateError(
          `Payload atribute: [skills.item] type isn't equal to string!`
        );
      }
    });
  };

  #workExperienceDetails = (workExperienceDetails: string) => {
    if (workExperienceDetails === undefined) {
      throw new ValidateError(
        `Payload atribute: [workExperienceDetails] doesn't exist!`
      );
    }

    if (!_.isString(workExperienceDetails)) {
      throw new ValidateError(
        `Payload atribute: [workExperienceDetails] type isn't equal to string!`
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
