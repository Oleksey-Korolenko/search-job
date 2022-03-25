import { DBConnection } from '@db/db';
import SkillTable from '@db/tables/skills';
import SkillsToCategoryTable from '@db/tables/skills-to-category';
import { DB, eq, SelectResponseJoin } from 'drizzle-orm';
import { inArray } from 'drizzle-orm/builders/requestBuilders/where/static';

export default class SkillsToCategoryQueryService extends DBConnection {
  #skillsToCategoryTable: SkillsToCategoryTable;

  constructor(db: DB) {
    super(db);
    this.#skillsToCategoryTable = new SkillsToCategoryTable(this.db);
  }

  public getAll = (): Promise<
    SelectResponseJoin<SkillsToCategoryTable, SkillTable, {}, {}>
  > =>
    this.#skillsToCategoryTable
      .select()
      .leftJoin(
        SkillTable,
        skillsToCategory => skillsToCategory.skillId,
        skills => skills.id
      )
      .execute();

  public getByCategoryId = (
    categoryItemId: number
  ): Promise<SelectResponseJoin<SkillsToCategoryTable, SkillTable, {}, {}>> =>
    this.#skillsToCategoryTable
      .select()
      .where(eq(this.#skillsToCategoryTable.categoryItemId, categoryItemId))
      .leftJoin(
        SkillTable,
        skillsToCategory => skillsToCategory.skillId,
        skills => skills.id
      )
      .execute();

  public getBySkillId = (
    skillId: number
  ): Promise<SelectResponseJoin<SkillsToCategoryTable, SkillTable, {}, {}>> =>
    this.#skillsToCategoryTable
      .select()
      .where(eq(this.#skillsToCategoryTable.skillId, skillId))
      .leftJoin(
        SkillTable,
        skillsToCategory => skillsToCategory.skillId,
        skills => skills.id
      )
      .execute();

  public getBySkillIds = (
    skillIds: number[]
  ): Promise<SelectResponseJoin<SkillsToCategoryTable, SkillTable, {}, {}>> =>
    this.#skillsToCategoryTable
      .select()
      .where(inArray(this.#skillsToCategoryTable.skillId, skillIds))
      .leftJoin(
        SkillTable,
        skillsToCategory => skillsToCategory.skillId,
        skills => skills.id
      )
      .execute();
}
