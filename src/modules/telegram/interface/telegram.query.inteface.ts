import { ITelegramTextFormatterExtra } from '.';

export interface ITelegramQueryHeaders {
  'Content-Type': string;
}

export interface ITelegramQueryBody extends ITelegramTextFormatterExtra {
  chat_id: number | string;
  text: string;
}

export interface ITelegramUpdateQueryBody extends ITelegramQueryBody {
  message_id: number | string;
}

export interface ITelegramResponseFile {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_path: string;
}

export interface ITelegramResponse<T> {
  ok: boolean;
  result: T;
  description: string;
}

export interface ITelegramGetFileBody {
  file_id: string;
}

export interface ITelegramSetChatDescriptionBody {
  chat_id: number | string;
  description: string;
}
