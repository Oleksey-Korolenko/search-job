import { DBConnection } from '@db/db';
import { SkillType } from '@db/tables';
import { DB } from 'drizzle-orm';
import { ISkillsWithCategoryId } from './interface';
import SkillsToCategoryQueryService from './skills-to-category.query.service';

export default class SkillsToCategoryService extends DBConnection {
  #skillsToCategoryQueryService: SkillsToCategoryQueryService;

  constructor(db: DB) {
    super(db);
    this.#skillsToCategoryQueryService = new SkillsToCategoryQueryService(db);
  }

  public getAll = async (): Promise<ISkillsWithCategoryId[]> => {
    const skillsToCategoryJoin =
      await this.#skillsToCategoryQueryService.getAll();

    return skillsToCategoryJoin.map((skillsToCategory, skills) => ({
      ...skills,
      categoryItemId: skillsToCategory.categoryItemId
    }));
  };

  public getByCategoryId = async (
    categoryItemId: number
  ): Promise<ISkillsWithCategoryId[]> => {
    const skillsToCategoryJoin =
      await this.#skillsToCategoryQueryService.getByCategoryId(categoryItemId);

    return skillsToCategoryJoin.map((skillsToCategory, skills) => ({
      ...skills,
      categoryItemId: skillsToCategory.categoryItemId
    }));
  };

  public getBySkillId = async (skillId: number): Promise<SkillType> => {
    const skillsToCategoryJoin =
      await this.#skillsToCategoryQueryService.getBySkillId(skillId);

    return skillsToCategoryJoin.map((skillsToCategory, skills) => ({
      ...skills
    }))[0];
  };

  public getBySkillIds = async (skillIds: number[]): Promise<SkillType[]> => {
    const skillsToCategoryJoin =
      await this.#skillsToCategoryQueryService.getBySkillIds(skillIds);

    return skillsToCategoryJoin.map((skillsToCategory, skills) => ({
      ...skills
    }));
  };
}
