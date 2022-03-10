export interface ITelegramMessageFrom {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}

export interface ITelegramMessageEntity {
  offset: number;
  length: number;
  type: string;
}

export interface ITelegramMessageChat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}

export interface ITelegramMessagePhoto {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface ITelegramMessageDocument {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  mime_type: string;
}

export interface ITelegramMessage {
  message_id: number;
  from: ITelegramMessageFrom;
  chat: ITelegramMessageChat;
  date: number;
  text: string;
  photo?: ITelegramMessagePhoto[];
  document?: ITelegramMessageDocument;
}

export interface ITelegramUpdateResponse {
  update_id: number;
  message: ITelegramMessage;
}
