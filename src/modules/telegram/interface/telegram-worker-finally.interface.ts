import { arrayValuesToType } from '@custom-types/array-values.type';
import {
  CategoryItemType,
  EEnglishLevelsType,
  EmploymentOptionsType,
  EWorkExperienceInMonthsType
} from '@db/tables';

export interface IWorkerFinally {
  name: string;
  categoryItem: CategoryItemType;
  workExperience: arrayValuesToType<typeof EWorkExperienceInMonthsType.values>;
  expectedSalary: number;
  position: string;
  englishLevel: arrayValuesToType<typeof EEnglishLevelsType.values>;
  workExperienceDetails: string;
  skills: string[];
  employmentOptions: EmploymentOptionsType[];
}
