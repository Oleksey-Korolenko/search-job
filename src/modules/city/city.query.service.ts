import { DBConnection } from '@db/db';
import CityTable, { CityType } from '@db/tables/cities';
import { DB, eq } from 'drizzle-orm';
import { inArray } from 'drizzle-orm/builders/requestBuilders/where/static';

export default class CityQueryService extends DBConnection {
  #cityTable: CityTable;

  constructor(db: DB) {
    super(db);
    this.#cityTable = new CityTable(this.db);
  }

  public getAll = (): Promise<CityType[]> => this.#cityTable.select().all();

  public getById = (cityId: number): Promise<CityType | undefined> =>
    this.#cityTable
      .select()
      .where(eq(this.#cityTable.id, cityId))
      .all()
      .then(res => res[0]);

  public getByIds = (cityIds: number[]): Promise<CityType[]> =>
    this.#cityTable.select().where(inArray(this.#cityTable.id, cityIds)).all();
}
