import { arrayValuesToType } from '@custom-types/array-values.type';
import { DBConnection } from '@db/db';
import { EUserRole, IEmployer, IWorker, TemporaryUserType } from '@db/tables';
import { DB } from 'drizzle-orm';
import { ITemporaryUserInput, ITemporaryUserWithRelations } from './interface';
import TemporaryUserQueryService from './temporary-user.query.service';
import { TemporaryUserValidate } from './temporary-user.validator';

export default class TemporaryUserService extends DBConnection {
  #temporaryUserQueryService: TemporaryUserQueryService;
  #validator: TemporaryUserValidate;

  constructor(db: DB) {
    super(db);
    this.#temporaryUserQueryService = new TemporaryUserQueryService(db);
    this.#validator = new TemporaryUserValidate();
  }

  public save = (
    temporaryUserInfo: ITemporaryUserInput
  ): Promise<TemporaryUserType | undefined> => {
    this.#validator.save(temporaryUserInfo);

    return this.#temporaryUserQueryService.save(temporaryUserInfo);
  };

  public getById = (id: number): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUserQueryService.getById(id);

  public getByUserIdAndRole = async (
    userId: string,
    role: arrayValuesToType<typeof EUserRole.values>
  ): Promise<ITemporaryUserWithRelations> => {
    const temporaryUser =
      await this.#temporaryUserQueryService.getByUserIdAndRole(userId, role);

    return temporaryUser.map(
      (temporaryUserT, telegramT) =>
        ({
          ...temporaryUserT,
          telegramUser: telegramT
        } as ITemporaryUserWithRelations)
    )[0];
  };

  public updateUser = (
    id: number,
    user: IWorker | IEmployer
  ): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUserQueryService.updateUser(id, user);

  public updateIsEdit = (
    id: number,
    isEdit: boolean
  ): Promise<TemporaryUserType | undefined> =>
    this.#temporaryUserQueryService.updateIsEdit(id, isEdit);

  public deleteTemporaryUser = (id: number) =>
    this.#temporaryUserQueryService.deleteTemporaryUser(id);
}
