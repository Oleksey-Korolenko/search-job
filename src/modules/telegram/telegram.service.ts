import TelegramApiService from './telegram.api.service';
import TelegramView from './telegram.view';

export default class TelegramService {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;

  constructor() {
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
  }

  public selectLanguage = async (chatId: number | string) => {
    const { text, extra } = this.#telegramView.selectLanguage();

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };
}
