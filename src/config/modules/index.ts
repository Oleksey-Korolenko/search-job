import common, { CommonConfigType } from './common';

export * from './common';

export type AppConfigFunctionType = {
  common: () => CommonConfigType;
};

export type AppConfigType = CommonConfigType;

export default { common };
