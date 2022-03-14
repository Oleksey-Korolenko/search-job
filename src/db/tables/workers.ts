import { AbstractTable, ExtractModel } from 'drizzle-orm';
import { createEnum } from 'drizzle-orm/types/type';
import CategoryItemTable from './category-items';
import TelegramTable from './telegram';

export const EWorkExperienceInMonthsType = createEnum({
  alias: 'work_experience_in_months_type',
  values: [
    '0',
    '6',
    '12',
    '18',
    '24',
    '30',
    '36',
    '48',
    '60',
    '72',
    '84',
    '96',
    '108',
    '120',
    '-1',
  ],
});

export const EEnglishLevelsType = createEnum({
  alias: 'english_levels_type',
  values: [
    'No English',
    'Begginner/Elementary',
    'Pre-Intermediate',
    'Intermediate',
    'Upper-Intermediate',
    'Advanced/Fluent',
  ],
});

export default class WorkerTable extends AbstractTable<WorkerTable> {
  public id = this.serial('id').primaryKey();

  public categoryItemId = this.int('category_item_id')
    .foreignKey(CategoryItemTable, (table) => table.id)
    .notNull();

  public workExperience = this.type(
    EWorkExperienceInMonthsType,
    'work_experience'
  );

  public expectedSalary = this.int('expected_salary').notNull();

  public position = this.varchar('position').notNull();

  public englishLevel = this.type(EEnglishLevelsType, 'english_levels');

  public workExperienceDetails = this.varchar('work_experience_details');

  public telegramUserId = this.int('telegram_user_id')
    .foreignKey(TelegramTable, (table) => table.id)
    .notNull();

  public tableName(): string {
    return 'workers';
  }
}

export type WorkerType = ExtractModel<WorkerTable>;
