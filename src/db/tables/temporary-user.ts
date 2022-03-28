import { arrayValuesToType } from '@custom-types/array-values.type';
import { AbstractTable, ExtractModel } from 'drizzle-orm';
import { createEnum } from 'drizzle-orm/types/type';
import TelegramTable from './telegram';
import { EWorkExperienceInMonthsType, EEnglishLevelsType } from './workers';

export interface IWorker {
  type: 'worker';
  name?: string;
  categoryItemId?: number;
  workExperience?: arrayValuesToType<typeof EWorkExperienceInMonthsType.values>;
  expectedSalary?: number;
  position?: string;
  englishLevel?: arrayValuesToType<typeof EEnglishLevelsType.values>;
  workExperienceDetails?: string;
  skills?: string[];
  employmentOptions?: number[];
}

export interface IEmployer {
  type: 'employer';
  name?: string;
  position?: string;
  company?: string;
  isUsesRootTelegramAcc?: boolean;
  extraTelegramAcc?: string;
  phone?: string;
}

export const EUserRole = createEnum({
  alias: 'user_role_type',
  values: ['worker', 'employer']
});

export default class TemporaryUserTable extends AbstractTable<TemporaryUserTable> {
  public id = this.serial('id').primaryKey();

  public isReadyToSave = this.bool('is_ready_to_save').notNull();

  public user = this.jsonb<IWorker | IEmployer>('user').notNull();

  public createdAt = this.timestamp('created_at').notNull();

  public telegramUserId = this.int('telegram_user_id')
    .foreignKey(TelegramTable, table => table.id)
    .notNull();

  public userRole = this.type(EUserRole, 'user_role').notNull();

  public tableName(): string {
    return 'temporary_user';
  }
}

export type TemporaryUserType = ExtractModel<TemporaryUserTable>;
