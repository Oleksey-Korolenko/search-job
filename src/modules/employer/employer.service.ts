import { DBConnection } from '@db/db';
import { EmployerType } from '@db/tables';
import { DB } from 'drizzle-orm';
import EmployerQueryService from './employer.query.service';
import { EmployerValidate } from './employer.validator';
import { IEmployerInput } from './interface';

export default class EmployerService extends DBConnection {
  #employerQueryService: EmployerQueryService;
  #employerValidator: EmployerValidate;

  constructor(db: DB) {
    super(db);
    this.#employerQueryService = new EmployerQueryService(db);
    this.#employerValidator = new EmployerValidate();
  }

  public save = (
    employer: IEmployerInput
  ): Promise<EmployerType | undefined> => {
    const input = this.#employerValidator.save(employer);

    return this.#employerQueryService.save(input);
  };

  public getByTelegramId = (
    telegramId: number
  ): Promise<EmployerType | undefined> =>
    this.#employerQueryService.getByTelegramId(telegramId);

  public getById = (id: number): Promise<EmployerType | undefined> =>
    this.#employerQueryService.getById(id);
}
