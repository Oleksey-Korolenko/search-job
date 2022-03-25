import { DBConnection } from '@db/db';
import EmploymentOptionsTable, {
  EmploymentOptionsType
} from '@db/tables/employment-options';
import { DB, eq } from 'drizzle-orm';

export default class EmploymentOptionsQueryService extends DBConnection {
  #employmentOptions: EmploymentOptionsTable;

  constructor(db: DB) {
    super(db);
    this.#employmentOptions = new EmploymentOptionsTable(this.db);
  }

  public getAll = (): Promise<EmploymentOptionsType[]> =>
    this.#employmentOptions.select().all();

  public getById = (id: number): Promise<EmploymentOptionsType> =>
    this.#employmentOptions
      .select()
      .where(eq(this.#employmentOptions.id, id))
      .all()
      .then(res => res[0]);
}
