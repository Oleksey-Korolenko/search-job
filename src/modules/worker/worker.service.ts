import { DBConnection } from '@db/db';
import { WorkerType } from '@db/tables';
import { DB } from 'drizzle-orm';
import { IWorkerInput } from './interface';
import WorkerQueryService from './worker.query.service';
import { WorkerValidate } from './worker.validator';

export default class WorkerService extends DBConnection {
  #workerQueryService: WorkerQueryService;
  #workerValidator: WorkerValidate;

  constructor(db: DB) {
    super(db);
    this.#workerQueryService = new WorkerQueryService(db);
    this.#workerValidator = new WorkerValidate();
  }

  public save = (worker: IWorkerInput): Promise<WorkerType | undefined> => {
    const input = this.#workerValidator.save(worker);

    return this.#workerQueryService.save(input);
  };

  public getByTelegramId = (
    telegramId: number
  ): Promise<WorkerType | undefined> =>
    this.#workerQueryService.getByTelegramId(telegramId);

  public getById = (id: number): Promise<WorkerType | undefined> =>
    this.#workerQueryService.getById(id);
}
