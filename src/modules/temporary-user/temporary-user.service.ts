import { DBConnection } from '@db/db';
import { TemporaryUserType } from '@db/tables';
import { DB } from 'drizzle-orm';
import { ITemporaryUserInput } from './interface';
import TemporaryUserQueryService from './temporary-user.query.service';

export default class TemporaryUserProcessorService extends DBConnection {
  #temporaryUserQueryService: TemporaryUserQueryService;

  constructor(db: DB) {
    super(db);
    this.#temporaryUserQueryService = new TemporaryUserQueryService(db);
  }

  public save = (
    temporaryUserInfo: ITemporaryUserInput
  ): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUserQueryService.save(temporaryUserInfo);

  public getById = (id: number): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUserQueryService.getById(id);

  /*
  public getByUserId = (
    userId: number
  ): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUserQueryService.getByUserId(userId);
  */
}
