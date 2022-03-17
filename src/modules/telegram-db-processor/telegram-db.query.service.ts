import { DBConnection } from '@db/db';
import TelegramTable, { TelegramType } from '@db/tables/telegram';
import { languageTypes } from '@modules/telegram/messages';
import { DB, eq } from 'drizzle-orm';
import { ITelegramDBInput } from './interface';

export default class TelegramDBQueryService extends DBConnection {
  #telegramDB: TelegramTable;

  constructor(db: DB) {
    super(db);
    this.#telegramDB = new TelegramTable(this.db);
  }

  public save = (
    telegramInfo: ITelegramDBInput
  ): Promise<TelegramType | undefined> =>
    this.#telegramDB
      .insert(telegramInfo)
      .all()
      .then(res => res[0] as TelegramType | undefined);

  public getById = (id: number) =>
    this.#telegramDB
      .select()
      .where(eq(this.#telegramDB.id, id))
      .all()
      .then(res => res[0] as TelegramType | undefined);

  public getByUserId = (userId: string) =>
    this.#telegramDB
      .select()
      .where(eq(this.#telegramDB.userId, userId))
      .all()
      .then(res => res[0] as TelegramType | undefined);

  public updateLanguage = (userId: string, language: languageTypes) =>
    this.#telegramDB
      .update()
      .set({
        language
      })
      .where(eq(this.#telegramDB.userId, userId))
      .all()
      .then(res => res[0] as TelegramType | undefined);
}
