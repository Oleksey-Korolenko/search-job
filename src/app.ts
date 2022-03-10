import express from 'express';
import requireAll from 'require-all';
import dotenv from 'dotenv';
import { catchError } from './middlewares';
import { LoggerService } from './logger';

const bootstrap = async () => {
  const app = express();
  const router = express.Router;

  dotenv.config();

  app.use(express.json({ limit: '3mb' }));

  const logger = new LoggerService().getLogger();

  const controllers = requireAll({
    dirname: `${__dirname}/modules`,
    filter: /^.+\.(controller)\.(t|j)s$/,
    recursive: true,
  });

  for (const name in controllers) {
    app.use(`/api/${name}`, await controllers[name].controller.default(router));

    logger.info(`Module ${name} initialized`);
  }

  app.use(catchError);

  return app;
};

export default bootstrap;
