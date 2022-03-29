import { Translate } from '@custom-types/translate.type';
import { TelegramType, TemporaryUserType } from '@db/tables';
import { IInlineKeyboardMarkup } from '.';

export interface IArgsForPreparedText {
  [key: string]: string | number;
}

export interface ITelegramTextFormatterExtra {
  reply_markup?: IInlineKeyboardMarkup;
  parse_mode?: 'HTML';
}

export interface ITelegramTextFormatterResponse {
  text: string;
  extra: ITelegramTextFormatterExtra;
}

export interface IPreparedTranslate {
  id: number;
  translate: string;
  isExist?: boolean;
}

export interface INotPreparedTranslate {
  id: number;
  name: string;
  translate: Translate;
  isExist?: boolean;
}

export interface ITelegramInfo {
  existTelegramInfo: TelegramType;
  existTemporaryUser: TemporaryUserType;
}
