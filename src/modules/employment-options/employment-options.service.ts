import { DBConnection } from '@db/db';
import { EmploymentOptionsType } from '@db/tables';
import { DB } from 'drizzle-orm';
import EmploymentOptionsQueryService from './employment-options.query.service';

export default class EmploymentOptionsService extends DBConnection {
  #employmentOptionsQueryService: EmploymentOptionsQueryService;

  constructor(db: DB) {
    super(db);
    this.#employmentOptionsQueryService = new EmploymentOptionsQueryService(db);
  }

  public getAll = (): Promise<EmploymentOptionsType[]> =>
    this.#employmentOptionsQueryService.getAll();

  public getById = (id: number): Promise<EmploymentOptionsType> =>
    this.#employmentOptionsQueryService.getById(id);
}
