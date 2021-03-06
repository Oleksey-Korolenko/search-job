import {
  ITelegramMessage,
  ITelegramMessageEntity,
  ITelegramMessageFrom
} from '.';
import { IInlineKeyboardMarkup } from './telegram-inline-keyboard-button.inteface';

export interface ITelegramButtonMessage extends ITelegramMessage {
  entities: ITelegramMessageEntity[];
  reply_markup: IInlineKeyboardMarkup;
}

export interface ITelegramButtonCallbackQuery {
  id: string;
  from: ITelegramMessageFrom;
  message: ITelegramButtonMessage;
  chat_instance: string;
  data: string;
}

export interface ITelegramButtonResponse {
  update_id: number;
  callback_query: ITelegramButtonCallbackQuery;
}
