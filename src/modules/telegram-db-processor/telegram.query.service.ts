import { DBConnection } from '@db/db';
import TelegramTable, { TelegramType } from '@db/tables/telegram';
import { languageTypes } from '@modules/telegram/messages';
import { and, DB, eq } from 'drizzle-orm';
import { ITelegramInput } from './interface';

export default class TelegramDBQueryService extends DBConnection {
  #telegramDB: TelegramTable;

  constructor(db: DB) {
    super(db);
    this.#telegramDB = new TelegramTable(this.db);
  }

  public save = (
    telegramInfo: ITelegramInput
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

  public getByUserId = (userId: number) =>
    this.#telegramDB
      .select()
      .where(eq(this.#telegramDB.userId, userId))
      .all()
      .then(res => res[0] as TelegramType | undefined);

  public updateLanguage = (userId: number, language: languageTypes) =>
    this.#telegramDB
      .update()
      .set({
        language
      })
      .where(eq(this.#telegramDB.userId, userId))
      .all()
      .then(res => res[0] as TelegramType | undefined);
}
