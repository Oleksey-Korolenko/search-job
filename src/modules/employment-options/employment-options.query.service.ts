import { DBConnection } from '@db/db';
import EmploymentOptionsTable, {
  EmploymentOptionsType
} from '@db/tables/employment-options';
import EmploymentOptionsToWorkersTable, {
  EmploymentOptionsToWorkersType
} from '@db/tables/employment-options-to-workers';
import { DB, eq } from 'drizzle-orm';
import { inArray } from 'drizzle-orm/builders/requestBuilders/where/static';

export default class EmploymentOptionsQueryService extends DBConnection {
  #employmentOptions: EmploymentOptionsTable;
  #employmentOptionsToWorker: EmploymentOptionsToWorkersTable;

  constructor(db: DB) {
    super(db);
    this.#employmentOptions = new EmploymentOptionsTable(this.db);
    this.#employmentOptionsToWorker = new EmploymentOptionsToWorkersTable(
      this.db
    );
  }

  public getAll = (): Promise<EmploymentOptionsType[]> =>
    this.#employmentOptions.select().all();

  public getById = (id: number): Promise<EmploymentOptionsType> =>
    this.#employmentOptions
      .select()
      .where(eq(this.#employmentOptions.id, id))
      .all()
      .then(res => res[0]);

  public getByIds = async (ids: number[]): Promise<EmploymentOptionsType[]> =>
    this.#employmentOptions
      .select()
      .where(inArray(this.#employmentOptions.id, ids))
      .all();

  public addedEmploymentOptionsToWorker = async (
    workerId: number,
    employmentOptionIds: number[]
  ): Promise<EmploymentOptionsToWorkersType[] | undefined> =>
    this.#employmentOptionsToWorker
      .insertMany(
        employmentOptionIds.map(it => ({
          employmentOptionsId: it,
          workerId
        }))
      )
      .all();
}
