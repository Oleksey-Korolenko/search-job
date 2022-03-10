import { LoggerService } from './logger';
import app from './app';
import { AppConfigService } from './config';

const bootstrap = async () => {
  const server = await app();

  const port = new AppConfigService().get('common').port;

  const logger = new LoggerService().getLogger();

  server.listen(port, () => {
    logger.info(`Started on ${port}`);
  });
};

bootstrap();
