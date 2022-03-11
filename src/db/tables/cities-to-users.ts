import { AbstractTable, ExtractModel } from 'drizzle-orm';
import CityTable from './cities';
import WorkerTable from './workers';

export default class CitiesToUsersTable extends AbstractTable<CitiesToUsersTable> {
  public workerId = this.int('worker_id')
    .foreignKey(WorkerTable, (table) => table.id)
    .notNull();

  public cityId = this.int('city_id')
    .foreignKey(CityTable, (table) => table.id)
    .notNull();

  public manyToManyIndex = this.uniqueIndex([this.workerId, this.cityId]);

  public tableName(): string {
    return 'cities_to_users';
  }
}

export type CitiesToUsersType = ExtractModel<CitiesToUsersTable>;
