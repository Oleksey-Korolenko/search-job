import { arrayValuesToType } from '@custom-types/array-values.type';
import { ETelegramMessageType } from '@db/tables';

export interface ITelegramMessageInput {
  chatId: string;
  messageId: string;
  userId: string;
  temporaryUserId: number;
  telegramMessageType: arrayValuesToType<typeof ETelegramMessageType.values>;
}
