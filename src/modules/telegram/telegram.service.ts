import TelegramApiService from './telegram.api.service';
import TelegramView from './telegram.view';
import { languageTypes } from './messages';
import TelegramDBProcessorService from '@modules/telegram-db-processor/telegram.service';
import { DBConnection } from '@db/db';
import { DB } from 'drizzle-orm';
import { ITelegramInput } from '@modules/telegram-db-processor';
import { TelegramType } from '@db/tables';

export default class TelegramService extends DBConnection {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;
  #telegramDBService: TelegramDBProcessorService;

  constructor(db: DB) {
    super(db);
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
    this.#telegramDBService = new TelegramDBProcessorService(this.db);
  }

  public saveTelegramInfo = async (telegramInfo: ITelegramInput) => {
    const existTelegramInfo = await this.#telegramDBService.getByUserId(
      telegramInfo.userId
    );

    if (existTelegramInfo !== undefined) {
      await this.#telegramDBService.updateLanguage(
        telegramInfo.userId,
        telegramInfo.language
      );
    } else {
      await this.#telegramDBService.save(telegramInfo);
    }
  };

  #getTelegramUser = async (
    userId: number,
    chatId: number | string
  ): Promise<TelegramType | undefined> => {
    const existTelegramInfo = await this.#telegramDBService.getByUserId(userId);

    if (existTelegramInfo !== undefined) {
      await this.selectLanguage(chatId);
      return undefined;
    }

    return existTelegramInfo;
  };

  public selectRole = async (
    chatId: number | string,
    messageId: number,
    userId: number
  ) => {
    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const { text, extra } = this.#telegramView.selectRole(
      existTelegramInfo.language
    );

    await this.#telegramApiService.updateMessage(
      chatId,
      messageId,
      text,
      extra
    );
  };

  public selectLanguage = async (chatId: number | string) => {
    const { text, extra } = this.#telegramView.selectLanguage();

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };
}
