import common, { CommonConfigType } from './common';
import telegram, { TelegramConfigType } from './telegram';

export * from './common';

export type AppConfigFunctionType = {
  common: () => CommonConfigType;
  telegram: () => TelegramConfigType;
};

export type AppConfigType = CommonConfigType;

export default { common, telegram };
