import { AppConfigService } from '@config/config.service';
import { CommonConfigType, DbConfigType } from '@config/modules';
import { DB, DbConnector, drizzle } from 'drizzle-orm';
import { LoggerService } from 'logger';
import path from 'path';

export const connect = async () => {
  const dbConfig: DbConfigType = new AppConfigService().get('db');
  const commonConfig: CommonConfigType = new AppConfigService().get('common');
  const logger = new LoggerService().getLogger();

  const db = await new DbConnector()
    .params({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      ssl:
        commonConfig.nodeEnv === 'develop'
          ? false
          : {
              rejectUnauthorized: false
            }
    })
    .connect()
    .then(res => {
      logger.info('DB connect successfully');
      return res;
    });

  await drizzle
    .migrator(db)
    .migrate(path.join(process.env.APP_ROOT ?? '', '/../drizzle.config.yml'));

  return db;
};

export class DBConnection {
  protected db: DB;

  constructor(db: DB) {
    this.db = db;
  }
}
