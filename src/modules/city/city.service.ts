import { DBConnection } from '@db/db';
import { CityType } from '@db/tables';
import { DB } from 'drizzle-orm';
import CityQueryService from './city.query.service';

export default class CityService extends DBConnection {
  #cityQueryService: CityQueryService;

  constructor(db: DB) {
    super(db);
    this.#cityQueryService = new CityQueryService(db);
  }

  public getAll = (): Promise<CityType[]> => this.#cityQueryService.getAll();

  public getById = (cityId: number): Promise<CityType | undefined> =>
    this.#cityQueryService.getById(cityId);

  public getByIds = (cityIds: number[]): Promise<CityType[]> =>
    this.#cityQueryService.getByIds(cityIds);
}
