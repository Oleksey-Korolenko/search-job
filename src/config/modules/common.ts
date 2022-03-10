export type CommonConfigType = {
  port: number;
  nodeEnv: 'production' | 'develop';
};

const common = (): CommonConfigType => ({
  port: process.env.PORT === undefined ? 8081 : +process.env.PORT,
  nodeEnv:
    process.env.NODE_ENV === undefined
      ? 'develop'
      : (process.env.NODE_ENV as 'production' | 'develop'),
});

export default common;
