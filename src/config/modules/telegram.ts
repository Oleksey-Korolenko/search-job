export type TelegramConfigType = {
  token: string;
  webhookHost: string;
  username: string;
};

const telegram = (): TelegramConfigType => ({
  token:
    process.env.TELEGRAM_ADMIN_TOKEN === undefined
      ? ''
      : process.env.TELEGRAM_ADMIN_TOKEN,
  webhookHost:
    process.env.TELEGRAM_WEBHOOK_HOST === undefined
      ? ''
      : process.env.TELEGRAM_WEBHOOK_HOST,
  username:
    process.env.TELEGRAM_USERNAME === undefined
      ? ''
      : process.env.TELEGRAM_USERNAME,
});

export default telegram;
