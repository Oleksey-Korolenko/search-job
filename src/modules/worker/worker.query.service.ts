import { DBConnection } from '@db/db';
import WorkerTable, { WorkerType } from '@db/tables/workers';
import { DB, eq } from 'drizzle-orm';
import { IWorkerInput } from './interface';

export default class WorkerQueryService extends DBConnection {
  #worker: WorkerTable;

  constructor(db: DB) {
    super(db);
    this.#worker = new WorkerTable(this.db);
  }

  public save = (worker: IWorkerInput): Promise<WorkerType | undefined> =>
    this.#worker
      .insert(worker)
      .all()
      .then(res => res[0] as WorkerType | undefined);

  public getByTelegramId = (telegramId: number) =>
    this.#worker
      .select()
      .where(eq(this.#worker.telegramUserId, telegramId))
      .all()
      .then(res => res[0] as WorkerType | undefined);

  public getById = (id: number) =>
    this.#worker
      .select()
      .where(eq(this.#worker.id, id))
      .all()
      .then(res => res[0] as WorkerType | undefined);
}
