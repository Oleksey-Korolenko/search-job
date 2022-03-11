import { AbstractTable, ExtractModel } from 'drizzle-orm';
import WorkerTable from './workers';
import EmpoymentOptionsTable from './employment-options';

export default class EmploymentOptionsToWorkersTable extends AbstractTable<EmploymentOptionsToWorkersTable> {
  public workerId = this.int('employer_id')
    .foreignKey(WorkerTable, (table) => table.id)
    .notNull();

  public employmentOptionsId = this.int('employment_options_id')
    .foreignKey(EmpoymentOptionsTable, (table) => table.id)
    .notNull();

  public manyToManyIndex = this.uniqueIndex([
    this.workerId,
    this.employmentOptionsId,
  ]);

  public tableName(): string {
    return 'employment_options_to_workers';
  }
}

export type EmploymentOptionsToWorkersType =
  ExtractModel<EmploymentOptionsToWorkersTable>;
