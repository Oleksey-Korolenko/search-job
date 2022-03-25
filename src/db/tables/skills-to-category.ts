import { AbstractTable, ExtractModel } from 'drizzle-orm';
import CategoryItemTable from './category-items';
import SkillTable from './skills';

export default class SkillsToCategoryTable extends AbstractTable<SkillsToCategoryTable> {
  public categoryItemId = this.int('category_item_id')
    .foreignKey(CategoryItemTable, table => table.id)
    .notNull();

  public skillId = this.int('skill_id')
    .foreignKey(SkillTable, table => table.id)
    .notNull();

  public manyToManyIndex = this.uniqueIndex([
    this.categoryItemId,
    this.skillId
  ]);

  public tableName(): string {
    return 'skills_to_category';
  }
}

export type SkillsToCategoryType = ExtractModel<SkillsToCategoryTable>;
