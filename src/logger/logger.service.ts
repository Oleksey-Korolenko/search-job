import winston, { Logger, format } from 'winston';

export class LoggerService {
  #winston: typeof winston;

  constructor() {
    this.#winston = winston;
  }

  #format = format.printf(({ level, message }) =>
    [`[${level.toUpperCase()}] - `, JSON.stringify(message, null, 2)].join('')
  );

  getLogger(): Logger {
    return this.#winston.createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      },
      format: format.combine(this.#format, format.colorize({ all: true })),
      transports: [new winston.transports.Console()],
    });
  }
}
