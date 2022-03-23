import TelegramApiService from './telegram.api.service';
import TelegramView from './telegram.view';
import TelegramDBProcessorService from '@modules/telegram-db-processor/telegram-db.service';
import { DBConnection } from '@db/db';
import { DB } from 'drizzle-orm';
import { ITelegramDBInput } from '@modules/telegram-db-processor';
import {
  ETelegramMessageType,
  EUserRole,
  IEmployer,
  IWorker,
  TelegramType,
  TemporaryUserType
} from '@db/tables';
import { arrayValuesToType } from '@custom-types/array-values.type';
import CategoryService from '@modules/category/category.service';
import CategoryItemService from '@modules/category-item/category-item.service';
import { Logger } from 'winston';
import { LoggerService } from '@logger/logger.service';
import { ITemporaryUserInput } from '@modules/temporary-user';
import TemporaryUserService from '@modules/temporary-user/temporary-user.service';
import { IInlineKeyboardButton, ITelegramMessage } from './interface';
import ETelegramButtonType from './enum/button-type.enum';
import TelegramMessageService from '@modules/telegram-messages/telegram-messages.service';
import { TelegramValidate } from './telegram.validator';
import ETelegramConfirmButtonType from './enum/confirm-button-type.enum';

export default class TelegramService extends DBConnection {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;
  #telegramValidator: TelegramValidate;

  #telegramDBService: TelegramDBProcessorService;
  #categoryService: CategoryService;
  #categoryItemService: CategoryItemService;
  #temporaryUserService: TemporaryUserService;
  #telegramMessageService: TelegramMessageService;

  #logger: Logger;

  constructor(db: DB) {
    super(db);
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
    this.#telegramValidator = new TelegramValidate();

    this.#telegramDBService = new TelegramDBProcessorService(this.db);
    this.#categoryService = new CategoryService(this.db);
    this.#categoryItemService = new CategoryItemService(this.db);
    this.#temporaryUserService = new TemporaryUserService(this.db);
    this.#telegramMessageService = new TelegramMessageService(this.db);

    this.#logger = new LoggerService().getLogger();
  }

  // check text command start

  public checkCommand = async (
    chatId: string,
    messageId: number,
    userId: string,
    command: string
  ) => {
    if (command[0] === '/') {
      // TODO something
    }

    const existMessage = await this.#telegramMessageService.getByTgInfo(
      userId,
      chatId,
      command as arrayValuesToType<typeof ETelegramMessageType.values>
    );

    if (existMessage === undefined) {
      return;
    }

    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const existTemporaryUser = await this.#getTemporaryUserById(
      existMessage.temporaryUserId,
      chatId
    );

    if (existTemporaryUser === undefined) {
      return;
    }

    switch (existMessage.telegramMessageType) {
      case 'salary': {
        try {
          const salary = this.#telegramValidator.salary(command);

          this.updateTemporaryUser(userId, {
            type: 'worker',
            expectedSalary: salary
          });

          await this.selectSuccess(
            chatId,
            userId,
            +messageId,
            command,
            ETelegramButtonType.SELECT_SALARY,
            existMessage.temporaryUserId
          );

          break;
        } catch (e) {
          this.#catchError(e);

          await this.#telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            command as arrayValuesToType<typeof ETelegramMessageType.values>
          );

          const { text, extra } = this.#telegramView.selectSalary(
            existTelegramInfo.language,
            true,
            ETelegramConfirmButtonType.SALARY
          );

          const result =
            await this.#telegramApiService.sendMessage<ITelegramMessage>(
              chatId,
              text,
              extra
            );

          await this.#telegramMessageService.save({
            chatId: `${result.result.chat.id}`,
            userId: `${result.result.from.id}`,
            messageId: `${result.result.message_id}`,
            temporaryUserId: existMessage.temporaryUserId,
            telegramMessageType: 'salary'
          });
        }
      }
    }
  };

  // check text command end

  // check yes button start

  public checkYesButton = async (
    chatId: string,
    messageId: number,
    userId: string,
    typeOperation: ETelegramConfirmButtonType
  ) => {
    const existMessage = await this.#telegramMessageService.getByTgInfo(
      userId,
      chatId,
      typeOperation as arrayValuesToType<typeof ETelegramMessageType.values>
    );

    if (existMessage === undefined) {
      return;
    }

    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const existTemporaryUser = await this.#getTemporaryUserById(
      existMessage.temporaryUserId,
      chatId
    );

    if (existTemporaryUser === undefined) {
      return;
    }

    switch (typeOperation) {
      case 'salary': {
        const { text, extra } = this.#telegramView.selectSalary(
          existTelegramInfo.language,
          false
        );

        await this.#telegramApiService.updateMessage<ITelegramMessage>(
          chatId,
          messageId,
          text,
          extra
        );
      }
    }
  };

  // check yes button end

  // TODO do something with no button action

  // telegram user section start

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

  // telegram user section end

  // user role section start

  public actionForRole = async (
    chatId: number | string,
    messageId: number,
    userId: string,
    role: arrayValuesToType<typeof EUserRole.values>
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
          await this.selectCategory(
            chatId,
            userId,
            temporaryUser.id,
            messageId
          );
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

  public selectRole = async (
    chatId: number | string,
    messageId: number,
    userId: string
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

  // user role section end

  // temporary user section start

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

  public updateTemporaryUser = async (
    userId: string,
    user: IWorker | IEmployer
  ) => {
    const temporaryUser = await this.#temporaryUserService.getByUserIdAndRole(
      userId,
      'worker'
    );

    // TODO написать к ид самой записи

    await this.#temporaryUserService.updateUser(temporaryUser.id, {
      ...temporaryUser.user,
      ...user
    });
  };

  // temporary user section end

  // worker category section start

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

  // worker category section end

  // worker experience section start

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

  // worker experience section end

  // worker salary section start

  public selectSalary = async (
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

    const { text, extra } = this.#telegramView.selectSalary(
      existTelegramInfo.language,
      false
    );

    const result = await this.#telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.#telegramMessageService.save({
      chatId: `${result.result.chat.id}`,
      userId: `${result.result.from.id}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'salary'
    });
  };

  // worker salary section end

  // user language section start

  public selectLanguage = async (chatId: number | string) => {
    const { text, extra } = this.#telegramView.selectLanguage();

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  // user language section end

  // user edit info section start

  public selectSuccess = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    currentItemText: string,
    operationType: ETelegramButtonType,
    temporaryUserId?: number
  ) => {
    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const { text, extra } = await this.#telegramView.selectSuccess(
      existTelegramInfo.language,
      currentItemText,
      operationType,
      temporaryUserId
    );

    await this.#telegramApiService.updateMessage(
      chatId,
      messageId,
      text,
      extra
    );
  };

  public findElemFromInlineKeyboard = (
    data: string,
    inlineKeyboard: IInlineKeyboardButton[][]
  ): string | undefined => {
    let currentItemText: string | undefined;

    inlineKeyboard.forEach(parent =>
      parent.forEach(it => {
        it.callback_data === data ? (currentItemText = it.text) : undefined;
      })
    );

    return currentItemText;
  };

  public selectSuccessWithInlineKeyboard = (
    chatId: number | string,
    userId: string,
    messageId: number,
    data: string,
    inlineKeyboard: IInlineKeyboardButton[][],
    operationType: ETelegramButtonType,
    temporaryUserId?: number
  ) => {
    const currentItemText = this.findElemFromInlineKeyboard(
      data,
      inlineKeyboard
    );

    if (currentItemText === undefined) {
      return;
    }

    this.selectSuccess(
      chatId,
      userId,
      messageId,
      currentItemText,
      operationType,
      temporaryUserId
    );
  };

  // user edit info section end

  #catchError = (err: Error) => {
    this.#logger.warn(err.message);
  };
}
