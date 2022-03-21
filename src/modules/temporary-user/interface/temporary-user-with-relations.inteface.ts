import { TelegramType, TemporaryUserType } from '@db/tables';

export interface ITemporaryUserWithRelations extends TemporaryUserType {
  telegramUser: TelegramType;
}
