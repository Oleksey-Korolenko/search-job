import { arrayValuesToType } from '@custom-types/array-values.type';
import { EEnglishLevelsType, EWorkExperienceInMonthsType } from '@db/tables';

export interface IWorkerInput {
  name: string;
  categoryItemId: number;
  workExperience: arrayValuesToType<typeof EWorkExperienceInMonthsType.values>;
  expectedSalary: number;
  position: string;
  englishLevel: arrayValuesToType<typeof EEnglishLevelsType.values>;
  skills: string[];
  workExperienceDetails: string;
  telegramUserId: number;
}
