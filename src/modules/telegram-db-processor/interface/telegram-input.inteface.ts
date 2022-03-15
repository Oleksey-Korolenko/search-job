import { languageTypes } from '@modules/telegram/messages';

export interface ITelegramInput {
  username: string;
  language: languageTypes;
  userId: number;
}
