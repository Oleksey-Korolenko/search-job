import TelegramApiService from './telegram.api.service';
import TelegramView from './telegram.view';

export default class TelegramService {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;

  constructor() {
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
  }

  public start = async (chatId: number | string) => {
    const text = this.#telegramView.start();

    await this.#telegramApiService.sendMessage(chatId, text);
  };
}
