import { AbstractTable, ExtractModel } from 'drizzle-orm';
import SkillTable from './skills';
import WorkerTable from './workers';

export default class SkillsToWorkersTable extends AbstractTable<SkillsToWorkersTable> {
  public workerId = this.int('worker_id')
    .foreignKey(WorkerTable, (table) => table.id)
    .notNull();

  public skillId = this.int('skill_id')
    .foreignKey(SkillTable, (table) => table.id)
    .notNull();

  public manyToManyIndex = this.uniqueIndex([this.workerId, this.skillId]);

  public tableName(): string {
    return 'skills_to_workers';
  }
}

export type SkillsToWorkersType = ExtractModel<SkillsToWorkersTable>;
