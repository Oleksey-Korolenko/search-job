import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole, IEmployer, IWorker } from '@db/tables';

export interface ITemporaryUserInput {
  user: IWorker | IEmployer;
  telegramUserId: number;
  userRole: arrayValuesToType<typeof EUserRole.values>;
  isEdit: boolean;
  isFinal: number;
}
