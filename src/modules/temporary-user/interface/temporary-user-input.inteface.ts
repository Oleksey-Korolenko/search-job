import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole, IEmployer, IWorker } from '@db/tables';

export interface ITemporaryUserInput {
  isReadyToSave: boolean;
  user: IWorker | IEmployer;
  telegramUserId: number;
  userRole: arrayValuesToType<typeof EUserRole.values>;
}
