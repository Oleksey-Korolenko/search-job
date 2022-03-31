import { arrayValuesToType } from '@custom-types/array-values.type';
import { DBConnection } from '@db/db';
import TelegramTable from '@db/tables/telegram';
import TemporaryUserTable, {
  TemporaryUserType,
  EUserRole,
  IEmployer,
  IWorker
} from '@db/tables/temporary-user';
import { and, DB, eq } from 'drizzle-orm';
import { ITemporaryUserInput } from './interface';

export default class TemporaryUserQueryService extends DBConnection {
  #temporaryUser: TemporaryUserTable;
  #telegram: TelegramTable;

  constructor(db: DB) {
    super(db);
    this.#temporaryUser = new TemporaryUserTable(this.db);
    this.#telegram = new TelegramTable(this.db);
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

  public getByUserIdAndRole = (
    userId: string,
    role: arrayValuesToType<typeof EUserRole.values>
  ) =>
    this.#temporaryUser
      .select()
      .where(
        and([
          eq(this.#temporaryUser.userRole, role),
          eq(this.#telegram.userId, userId)
        ])
      )
      .leftJoin(
        TelegramTable,
        temporaryUser => temporaryUser.id,
        telegram => telegram.id
      )
      .execute();

  public getByUserId = (userId: string) =>
    this.#temporaryUser
      .select()
      .where(eq(this.#telegram.userId, userId))
      .leftJoin(
        TelegramTable,
        temporaryUser => temporaryUser.id,
        telegram => telegram.id
      )
      .execute();

  public updateUser = (id: number, user: IWorker | IEmployer) =>
    this.#temporaryUser
      .update()
      .set({ user })
      .where(eq(this.#temporaryUser.id, id))
      .all()
      .then(res => res[0] as TemporaryUserType | undefined);

  public updateEditOptions = (id: number, isEdit: boolean, isFinal: number) =>
    this.#temporaryUser
      .update()
      .set({ isEdit, isFinal })
      .where(eq(this.#temporaryUser.id, id))
      .all()
      .then(res => res[0] as TemporaryUserType | undefined);

  public deleteTemporaryUser = (id: number) =>
    this.#temporaryUser
      .delete()
      .where(eq(this.#temporaryUser.id, id))
      .execute();
}
