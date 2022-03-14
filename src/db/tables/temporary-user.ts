import { AbstractTable, ExtractModel } from 'drizzle-orm';
import TelegramTable from './telegram';
import { EWorkExperienceInMonthsType, EEnglishLevelsType } from './workers';

export interface IWorker {
  type: 'worker';
  categoryItemId?: number;
  workExperience?: typeof EWorkExperienceInMonthsType;
  expectedSalary?: number;
  position?: string;
  englishLevel?: typeof EEnglishLevelsType;
  workExperienceDetails?: string;
  skillsToWorkers?: number[];
  employmentOptions?: number[];
  cities?: number[];
  categoryItems?: number[];
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

export default class TemporaryUserTable extends AbstractTable<TemporaryUserTable> {
  public id = this.serial('id').primaryKey();

  public isReadyToSave = this.bool('is_ready_to_save').notNull();

  public user = this.jsonb<IWorker | IEmployer>('user').notNull();

  public createdAt = this.timestamp('created_at').notNull();

  public telegramUserId = this.int('telegram_user_id')
    .foreignKey(TelegramTable, (table) => table.id)
    .notNull();

  public tableName(): string {
    return 'temporary_user';
  }
}

export type TemporaryUserType = ExtractModel<TemporaryUserTable>;
