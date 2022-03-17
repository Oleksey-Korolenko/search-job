import { DBConnection } from '@db/db';
import TemporaryUserTable, {
  TemporaryUserType
} from '@db/tables/temporary-user';
import { DB, eq } from 'drizzle-orm';
import { ITemporaryUserInput } from './interface';

export default class TemporaryUserQueryService extends DBConnection {
  #temporaryUser: TemporaryUserTable;

  constructor(db: DB) {
    super(db);
    this.#temporaryUser = new TemporaryUserTable(this.db);
  }

  public save = (
    temporaryUser: ITemporaryUserInput
  ): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUser
      .insert({ ...temporaryUser, createdAt: new Date() })
      .all()
      .then(res => res[0] as TemporaryUserType | undefined);

  public getById = (id: number) =>
    this.#temporaryUser
      .select()
      .where(eq(this.#temporaryUser.id, id))
      .all()
      .then(res => res[0] as TemporaryUserType | undefined);

  /*
  public getByUserId = (userId: number) =>
    this.#temporaryUser
      .select()
      .where(eq(this.#temporaryUser.userId, userId))
      .all()
      .then(res => res[0] as TemporaryUserType | undefined);
*/
}
