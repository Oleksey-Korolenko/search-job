import TelegramApiService from './telegram.api.service';
import TelegramView from './telegram.view';
import TelegramDBProcessorService from '@modules/telegram-db-processor/telegram-db.service';
import { DBConnection } from '@db/db';
import { DB } from 'drizzle-orm';
import { ITelegramDBInput } from '@modules/telegram-db-processor';
import { EUserRole, TelegramType, TemporaryUserType } from '@db/tables';
import { arrayValuesToType } from '@custom-types/array-values.type';
import CategoryService from '@modules/category/category.service';
import CategoryItemService from '@modules/category-item/category-item.service';
import { Logger } from 'winston';
import { LoggerService } from '@logger/logger.service';
import { ITemporaryUserInput } from '@modules/temporary-user';
import TemporaryUserService from '@modules/temporary-user/temporary-user.service';
import { IInlineKeyboardButton } from './interface';

export default class TelegramService extends DBConnection {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;
  #telegramDBService: TelegramDBProcessorService;
  #categoryService: CategoryService;
  #categoryItemService: CategoryItemService;
  #temporaryUserService: TemporaryUserService;
  #logger: Logger;

  constructor(db: DB) {
    super(db);
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
    this.#telegramDBService = new TelegramDBProcessorService(this.db);
    this.#categoryService = new CategoryService(this.db);
    this.#categoryItemService = new CategoryItemService(this.db);
    this.#temporaryUserService = new TemporaryUserService(this.db);
    this.#logger = new LoggerService().getLogger();
  }

  public saveTelegramInfo = async (telegramInfo: ITelegramDBInput) => {
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

  public actionForRole = async (
    chatId: number | string,
    messageId: number,
    userId: string,
    role: arrayValuesToType<typeof EUserRole.values>,
    data: string,
    inlineKeyboard: IInlineKeyboardButton[][]
  ) => {
    try {
      const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

      if (existTelegramInfo === undefined) {
        return;
      }

      switch (role) {
        case 'worker': {
          const temporaryUser = await this.#saveTemporaryUser({
            isReadyToSave: false,
            userRole: 'worker',
            telegramUserId: existTelegramInfo.id,
            user: {
              type: 'worker'
            }
          });
          await this.selectSuccess(
            chatId,
            userId,
            messageId,
            data,
            inlineKeyboard,
            temporaryUser.id
          );
          await this.selectCategory(chatId, userId, temporaryUser.id);
          return temporaryUser.id;
        }
        case 'employer': {
          break;
        }
      }
    } catch (e) {
      this.#catchError(e);
    }
  };

  #saveTemporaryUser = async (
    temporaryUser: ITemporaryUserInput
  ): Promise<TemporaryUserType | undefined> => {
    try {
      return await this.#temporaryUserService.save(temporaryUser);
    } catch (e) {
      this.#catchError(e);
      return undefined;
    }
  };

  #getTelegramUser = async (
    userId: string,
    chatId: number | string
  ): Promise<TelegramType | undefined> => {
    const existTelegramInfo = await this.#telegramDBService.getByUserId(userId);

    if (existTelegramInfo === undefined) {
      await this.selectLanguage(chatId);
      return undefined;
    }

    return existTelegramInfo;
  };

  #getTemporaryUserById = async (
    temporaryUserId: number,
    chatId: number | string
  ): Promise<TemporaryUserType | undefined> => {
    const existTemporaryUser = await this.#temporaryUserService.getById(
      temporaryUserId
    );

    if (existTemporaryUser === undefined) {
      // await this.selectLanguage(chatId);
      // TODO сделать что-то для вывода ошибки
      return undefined;
    }

    return existTemporaryUser;
  };

  public selectCategory = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId?: number
  ) => {
    try {
      const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

      if (existTelegramInfo === undefined) {
        return;
      }

      const existTemporaryUser = await this.#getTemporaryUserById(
        temporaryUserId,
        chatId
      );

      if (existTemporaryUser === undefined) {
        return;
      }

      const categories = await this.#categoryService.getAll();

      const { text, extra } = this.#telegramView.selectCategory(
        existTelegramInfo.language,
        categories,
        temporaryUserId
      );

      if (messageId === undefined) {
        await this.#telegramApiService.sendMessage(chatId, text, extra);
      } else {
        await this.#telegramApiService.updateMessage(
          chatId,
          messageId,
          text,
          extra
        );
      }
    } catch (e) {
      this.#catchError(e);
    }
  };

  public selectCategoryItems = async (
    chatId: number | string,
    messageId: number,
    userId: string,
    categoryId: number,
    temporaryUserId: number
  ) => {
    try {
      const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

      if (existTelegramInfo === undefined) {
        return;
      }

      const existTemporaryUser = await this.#getTemporaryUserById(
        temporaryUserId,
        chatId
      );

      if (existTemporaryUser === undefined) {
        return;
      }

      const category = await this.#categoryService.getById(categoryId);

      const categoryItems = await this.#categoryItemService.getByCategoryId(
        categoryId
      );

      const { text, extra } = this.#telegramView.selectCategoryItem(
        existTelegramInfo.language,
        category,
        categoryItems,
        temporaryUserId
      );

      await this.#telegramApiService.updateMessage(
        chatId,
        messageId,
        text,
        extra
      );
    } catch (e) {
      this.#catchError(e);
    }
  };

  public updateCategoryItem = async (
    userId: string,
    categoryItemId: number
  ) => {
    const temporaryUser = await this.#temporaryUserService.getByUserIdAndRole(
      userId,
      'worker'
    );

    await this.#temporaryUserService.updateUser(temporaryUser.id, {
      ...temporaryUser.user,
      type: 'worker',
      categoryItemId
    });
  };

  public selectExperience = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const existTemporaryUser = await this.#getTemporaryUserById(
      temporaryUserId,
      chatId
    );

    if (existTemporaryUser === undefined) {
      return;
    }

    const { text, extra } = this.#telegramView.selectExperience(
      existTelegramInfo.language,
      temporaryUserId
    );

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  public selectRole = async (chatId: number | string, userId: string) => {
    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const { text, extra } = this.#telegramView.selectRole(
      existTelegramInfo.language
    );

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  public selectLanguage = async (chatId: number | string) => {
    const { text, extra } = this.#telegramView.selectLanguage();

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  public selectSuccess = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    data: string,
    inlineKeyboard: IInlineKeyboardButton[][],
    temporaryUserId?: number
  ) => {
    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    let currentItemText: string | undefined;

    inlineKeyboard.forEach(parent =>
      parent.forEach(it => {
        it.callback_data === data ? (currentItemText = it.text) : undefined;
      })
    );

    if (currentItemText === undefined) {
      //
    } else {
      const { text, extra } = await this.#telegramView.selectSuccess(
        existTelegramInfo.language,
        currentItemText,
        temporaryUserId
      );

      await this.#telegramApiService.updateMessage(
        chatId,
        messageId,
        text,
        extra
      );
    }
  };

  #catchError = (err: Error) => {
    this.#logger.warn(err.message);
  };
}
