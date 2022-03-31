import { DBConnection } from '@db/db';
import {
  IEmployer,
  IWorker,
  TelegramType,
  TemporaryUserType
} from '@db/tables';
import { LoggerService } from '@logger/logger.service';
import CategoryItemService from '@modules/category-item/category-item.service';
import CategoryService from '@modules/category/category.service';
import EmployerService from '@modules/employer/employer.service';
import EmploymentOptionsService from '@modules/employment-options/employment-options.service';
import { ITelegramDBInput } from '@modules/telegram-db-processor';
import TelegramDBProcessorService from '@modules/telegram-db-processor/telegram-db.service';
import TelegramMessageService from '@modules/telegram-messages/telegram-messages.service';
import { ITemporaryUserInput } from '@modules/temporary-user';
import TemporaryUserService from '@modules/temporary-user/temporary-user.service';
import WorkerService from '@modules/worker/worker.service';
import { DB } from 'drizzle-orm';
import { Logger } from 'winston';
import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import {
  IInlineKeyboardButton,
  INotPreparedTranslate,
  ITelegramInfo
} from '../interface';
import TelegramApiService from '../telegram.api.service';
import { TelegramValidate } from '../telegram.validator';
import { TelegramView } from '../views';

export default class TelegramCommonService extends DBConnection {
  protected telegramView: TelegramView;
  protected telegramApiService: TelegramApiService;
  protected telegramValidator: TelegramValidate;

  protected temporaryUserService: TemporaryUserService;
  protected telegramDBService: TelegramDBProcessorService;
  protected telegramMessageService: TelegramMessageService;

  protected categoryService: CategoryService;
  protected categoryItemService: CategoryItemService;
  protected employmentOptionsService: EmploymentOptionsService;
  protected workerService: WorkerService;
  protected employerService: EmployerService;

  #logger: Logger;

  constructor(db: DB) {
    super(db);
    this.telegramView = new TelegramView();
    this.telegramApiService = new TelegramApiService();
    this.telegramValidator = new TelegramValidate();

    this.temporaryUserService = new TemporaryUserService(this.db);
    this.telegramDBService = new TelegramDBProcessorService(this.db);
    this.telegramMessageService = new TelegramMessageService(this.db);

    this.categoryService = new CategoryService(this.db);
    this.categoryItemService = new CategoryItemService(this.db);
    this.employmentOptionsService = new EmploymentOptionsService(this.db);
    this.workerService = new WorkerService(this.db);
    this.employerService = new EmployerService(this.db);

    this.#logger = new LoggerService().getLogger();
  }

  // TEMPORARY USER SECTION

  protected saveTemporaryUser = async (
    temporaryUser: ITemporaryUserInput
  ): Promise<TemporaryUserType | undefined> => {
    try {
      return await this.temporaryUserService.save(temporaryUser);
    } catch (e) {
      this.catchError(e);
      return undefined;
    }
  };

  protected getTemporaryUserById = async (
    temporaryUserId: number,
    chatId: number | string
  ): Promise<TemporaryUserType | undefined> => {
    const existTemporaryUser = await this.temporaryUserService.getById(
      temporaryUserId
    );

    if (existTemporaryUser === undefined) {
      // await this.selectLanguage(chatId);
      // TODO сделать что-то для вывода ошибки
      return undefined;
    }

    return existTemporaryUser;
  };

  protected updateTemporaryUser = async (
    temporaryUserId: number,
    user: IWorker | IEmployer
  ): Promise<TemporaryUserType | undefined> => {
    const temporaryUser = await this.temporaryUserService.getById(
      temporaryUserId
    );

    return await this.temporaryUserService.updateUser(temporaryUser.id, {
      ...temporaryUser.user,
      ...user
    });
  };

  protected updateTemporaryUserEditMode = async (
    temporaryUserId: number,
    isEdit: boolean
  ): Promise<TemporaryUserType | undefined> =>
    this.temporaryUserService.updateIsEdit(temporaryUserId, isEdit);

  // TEMPORARY USER SECTION

  // TELEGRAM USER SECTION

  protected saveTelegramInfo = async (telegramInfo: ITelegramDBInput) => {
    const existTelegramInfo = await this.telegramDBService.getByUserId(
      telegramInfo.userId
    );

    if (existTelegramInfo !== undefined) {
      await this.telegramDBService.updateLanguage(
        telegramInfo.userId,
        telegramInfo.language
      );
    } else {
      await this.telegramDBService.save(telegramInfo);
    }
  };

  protected getTelegramUser = async (
    userId: string,
    chatId: number | string
  ): Promise<TelegramType | undefined> => {
    const existTelegramInfo = await this.telegramDBService.getByUserId(userId);

    if (existTelegramInfo === undefined) {
      await this.startMessage(chatId);

      return undefined;
    }

    return existTelegramInfo;
  };

  // TELEGRAM USER SECTION

  // TELEGRAM DEFAULT SECTION

  protected startMessage = async (chatId: number | string) => {
    const { text, extra } = this.telegramView.selectLanguage();

    await this.telegramApiService.sendMessage(chatId, text, extra);
  };

  protected telegramCheck = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ): Promise<ITelegramInfo | undefined> => {
    const existTelegramInfo = await this.getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return undefined;
    }

    const existTemporaryUser = await this.getTemporaryUserById(
      temporaryUserId,
      chatId
    );

    if (existTemporaryUser === undefined) {
      return undefined;
    }

    return {
      existTelegramInfo,
      existTemporaryUser
    };
  };

  protected deleteItemFromArr = (
    existItems: number[],
    item: number
  ): number[] => {
    const preparedItems: number[] = [];

    existItems.forEach(it => {
      it === item ? '' : preparedItems.push(it);
    });

    return preparedItems;
  };

  protected getPreparedCheckboxItems = async (
    checkboxType: ETelegramCheckboxButtonType,
    existItemIds: number[]
  ): Promise<INotPreparedTranslate[]> => {
    let items: INotPreparedTranslate[];

    switch (checkboxType) {
      case ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS: {
        items =
          (await this.employmentOptionsService.getAll()) as INotPreparedTranslate[];

        break;
      }
    }

    return items.map(it =>
      existItemIds.includes(it.id)
        ? { ...it, isExist: true }
        : { ...it, isExist: false }
    );
  };

  protected catchError = (err: Error) => {
    this.#logger.warn(err.message);
  };

  protected findElemFromInlineKeyboard = (
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

  // TELEGRAM DEFAULT SECTION
}
