import { SkillType } from '@db/tables';

export interface ISkillsWithCategoryId extends SkillType {
  categoryItemId: number;
}
