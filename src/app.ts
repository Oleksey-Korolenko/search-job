import express from 'express';
import requireAll from 'require-all';
import dotenv from 'dotenv';
import { catchError } from './middlewares';
import { LoggerService } from './logger';
import { connect } from './db';

const bootstrap = async () => {
  process.env.APP_ROOT = __dirname;

  const app = express();
  const router = express.Router;

  dotenv.config();

  const db = await connect();

  app.use(express.json({ limit: '3mb' }));

  const logger = new LoggerService().getLogger();

  const controllers = requireAll({
    dirname: `${__dirname}/modules`,
    filter: /^.+\.(controller)\.(t|j)s$/,
    recursive: true,
  });

  for (const name in controllers) {
    app.use(
      `/api/${name}`,
      await controllers[name].controller.default(router, db)
    );

    logger.info(`Module ${name} initialized`);
  }

  app.use(catchError);

  return app;
};

export default bootstrap;
