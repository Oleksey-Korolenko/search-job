import { languageTypes } from '@modules/telegram/messages';

export interface ITelegramDBInput {
  username: string;
  language: languageTypes;
  userId: string;
}
