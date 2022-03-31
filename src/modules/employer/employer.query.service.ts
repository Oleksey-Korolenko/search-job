import { DBConnection } from '@db/db';
import EmployerTable, { EmployerType } from '@db/tables/employers';
import { DB, eq } from 'drizzle-orm';
import { IEmployerInput } from './interface';

export default class EmployerQueryService extends DBConnection {
  #employer: EmployerTable;

  constructor(db: DB) {
    super(db);
    this.#employer = new EmployerTable(this.db);
  }

  public save = (employer: IEmployerInput): Promise<EmployerType | undefined> =>
    this.#employer
      .insert(employer)
      .all()
      .then(res => res[0] as EmployerType | undefined);

  public getByTelegramId = (telegramId: number) =>
    this.#employer
      .select()
      .where(eq(this.#employer.telegramUserId, telegramId))
      .all()
      .then(res => res[0] as EmployerType | undefined);

  public getById = (id: number) =>
    this.#employer
      .select()
      .where(eq(this.#employer.id, id))
      .all()
      .then(res => res[0] as EmployerType | undefined);
}
