import TelegramApiService from './telegram.api.service';
import TelegramView from './telegram.view';
import { languagePackType } from './messages';

export default class TelegramService {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;

  constructor() {
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
  }

  public selectRole = async (
    k: keyof languagePackType,
    chatId: number | string,
    messageId: number
  ) => {
    const { text, extra } = this.#telegramView.selectRole(k);

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
