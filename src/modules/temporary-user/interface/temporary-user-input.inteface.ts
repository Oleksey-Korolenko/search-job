import { IEmployer, IWorker } from '@db/tables';

export interface ITemporaryUserInput {
  isReadyToSave: boolean;
  user: IWorker | IEmployer;
  telegramUserId: number;
}
