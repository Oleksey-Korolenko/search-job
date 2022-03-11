import common, { CommonConfigType } from './common';
import db, { DbConfigType } from './db';
import telegram, { TelegramConfigType } from './telegram';

export * from './common';
export * from './telegram';
export * from './db';

export type AppConfigFunctionType = {
  common: () => CommonConfigType;
  telegram: () => TelegramConfigType;
  db: () => DbConfigType;
};

export type AppConfigType = CommonConfigType;

export default { common, telegram, db };
