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
import {
  IInlineKeyboardButton,
  INotPreparedTranslate,
  ITelegramMessage
} from './interface';
import TelegramMessageService from '@modules/telegram-messages/telegram-messages.service';
import { TelegramValidate } from './telegram.validator';
import ETelegramConfirmButtonType from './enum/confirm-button-type.enum';
import CityService from '@modules/city/city.service';
import ETelegramCheckboxButtonType from './enum/checkbox-button-type.enum';
import ETelegramEditButtonType from './enum/edit-button-type.enum';
import SkillsToCategoryService from '@modules/skills-to-category/skills-to-category.service';
import EmploymentOptionsService from '@modules/employment-options/employment-options.service';

export default class TelegramService extends DBConnection {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;
  #telegramValidator: TelegramValidate;

  #telegramDBService: TelegramDBProcessorService;
  #temporaryUserService: TemporaryUserService;
  #telegramMessageService: TelegramMessageService;

  #categoryService: CategoryService;
  #categoryItemService: CategoryItemService;
  #cityService: CityService;
  #skillsToCategoryService: SkillsToCategoryService;
  #employmentOptionsService: EmploymentOptionsService;

  #logger: Logger;

  constructor(db: DB) {
    super(db);
    this.#telegramApiService = new TelegramApiService();
    this.#telegramView = new TelegramView();
    this.#telegramValidator = new TelegramValidate();

    this.#telegramDBService = new TelegramDBProcessorService(this.db);
    this.#temporaryUserService = new TemporaryUserService(this.db);
    this.#telegramMessageService = new TelegramMessageService(this.db);

    this.#categoryService = new CategoryService(this.db);
    this.#categoryItemService = new CategoryItemService(this.db);
    this.#cityService = new CityService(this.db);
    this.#skillsToCategoryService = new SkillsToCategoryService(this.db);
    this.#employmentOptionsService = new EmploymentOptionsService(this.db);

    this.#logger = new LoggerService().getLogger();
  }

  // check text command start

  public checkCommand = async (
    chatId: string,
    messageId: number,
    userId: string,
    text: string
  ) => {
    if (text[0] === '/') {
      // TODO something
      return;
    }

    const existMessage = await this.#telegramMessageService.getByTgInfo(
      userId,
      chatId
    );

    if (existMessage === undefined) {
      return;
    }

    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      existMessage.temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    switch (existMessage.telegramMessageType) {
      case 'salary': {
        try {
          const salary = this.#telegramValidator.salary(text);

          this.updateTemporaryUser(existMessage.temporaryUserId, {
            type: 'worker',
            expectedSalary: salary
          });

          await this.selectSuccess(
            chatId,
            userId,
            +messageId,
            text,
            ETelegramEditButtonType.SALARY,
            'item',
            existMessage.temporaryUserId
          );

          await this.selectPosition(
            chatId,
            userId,
            existMessage.temporaryUserId
          );

          await this.#telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            existMessage.telegramMessageType
          );

          break;
        } catch (e) {
          this.#catchError(e);

          await this.#telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            existMessage.telegramMessageType
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
      case 'position': {
        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: existTemporaryUser.user.type,
          position: text
        });

        await this.selectSuccess(
          chatId,
          userId,
          +messageId,
          text,
          ETelegramEditButtonType.POSITION,
          'item',
          existMessage.temporaryUserId
        );

        await this.#telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        await this.selectEnglishLevel(
          chatId,
          userId,
          existMessage.temporaryUserId
        );

        break;
      }
      case 'details': {
        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: existTemporaryUser.user.type,
          position: text
        });

        await this.selectSuccess(
          chatId,
          userId,
          +messageId,
          text,
          ETelegramEditButtonType.EXPERIENCE_DETAILS,
          'item',
          existMessage.temporaryUserId
        );

        await this.#telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        break;
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
    const existMessage =
      await this.#telegramMessageService.getByTgInfoWithOperationType(
        userId,
        chatId,
        typeOperation as arrayValuesToType<typeof ETelegramMessageType.values>
      );

    if (existMessage === undefined) {
      return;
    }

    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      existMessage.temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

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

  // check checkbox button start

  public checkCheckboxButton = async (
    chatId: string | number,
    messageId: number,
    userId: string,
    temporaryUserId: number,
    typeMessage: ETelegramCheckboxButtonType,
    typeOperation: 'add' | 'delete' | 'save',
    item: number
  ) => {
    switch (typeMessage) {
      case ETelegramCheckboxButtonType.CITY: {
        if (typeOperation === 'save') {
          await this.saveCities(chatId, userId, messageId, temporaryUserId);
        } else if (typeOperation === 'add' || typeOperation === 'delete') {
          await this.checkboxCity(
            chatId,
            userId,
            messageId,
            temporaryUserId,
            item,
            typeOperation
          );
        }
      }
      case ETelegramCheckboxButtonType.SKILL: {
        if (typeOperation === 'save') {
          await this.saveSkills(chatId, userId, messageId, temporaryUserId);
        } else if (typeOperation === 'add' || typeOperation === 'delete') {
          await this.checkboxSkill(
            chatId,
            userId,
            messageId,
            temporaryUserId,
            item,
            typeOperation
          );
        }
      }
      case ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS: {
        if (typeOperation === 'save') {
          await this.saveEmploymentOptions(
            chatId,
            userId,
            messageId,
            temporaryUserId
          );
        } else if (typeOperation === 'add' || typeOperation === 'delete') {
          await this.checkboxEmploymentOptions(
            chatId,
            userId,
            messageId,
            temporaryUserId,
            item,
            typeOperation
          );
        }
      }
      // TODO something for default case
    }
  };

  // check checkbox button end

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
    temporaryUserId: number,
    user: IWorker | IEmployer
  ) => {
    const temporaryUser = await this.#temporaryUserService.getById(
      temporaryUserId
    );

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
      const telegramInfo = await this.#telegramCheck(
        chatId,
        userId,
        temporaryUserId
      );

      if (telegramInfo === undefined) {
        return;
      }

      const { existTelegramInfo } = telegramInfo;

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
      const telegramInfo = await this.#telegramCheck(
        chatId,
        userId,
        temporaryUserId
      );

      if (telegramInfo === undefined) {
        return;
      }

      const { existTelegramInfo } = telegramInfo;

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
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

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
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

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

  // user position section start

  public selectPosition = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.#telegramView.selectPosition(
      existTelegramInfo.language
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
      telegramMessageType: 'position'
    });
  };

  // user position section end

  // worker english level section start

  public selectEnglishLevel = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.#telegramView.selectEnglishLevel(
      existTelegramInfo.language,
      temporaryUserId
    );

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  // worker english level section end

  // worker city section start

  public selectCity = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.CITY,
      temporaryUserInfo?.cities === undefined ? [] : temporaryUserInfo.cities
    );

    const { text, extra } = this.#telegramView.selectCity(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      []
    );

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  public checkboxCity = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number,
    cityId: number,
    typeOperation: 'add' | 'delete'
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    let preparedCityIds: number[] = [];

    switch (typeOperation) {
      case 'add': {
        preparedCityIds =
          temporaryUserInfo?.cities === undefined
            ? [cityId]
            : [...temporaryUserInfo.cities, cityId];

        break;
      }
      case 'delete': {
        preparedCityIds = this.#deleteItemFromArr(
          temporaryUserInfo?.cities === undefined
            ? []
            : temporaryUserInfo.cities,
          cityId
        );

        break;
      }
    }

    await this.updateTemporaryUser(temporaryUserId, {
      type: 'worker',
      cities: preparedCityIds
    });

    const existCities = await this.#cityService.getByIds(preparedCityIds);

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.CITY,
      temporaryUserInfo?.cities === undefined ? [] : temporaryUserInfo.cities
    );

    const { text, extra } = this.#telegramView.selectCity(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      existCities as INotPreparedTranslate[]
    );

    await this.#telegramApiService.updateMessage(
      chatId,
      messageId,
      text,
      extra
    );
  };

  public saveCities = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.CITY,
      temporaryUserInfo?.cities === undefined ? [] : temporaryUserInfo.cities
    );

    await this.selectSuccess(
      chatId,
      userId,
      messageId,
      notPreparedTranslate,
      ETelegramEditButtonType.CITY,
      'list',
      temporaryUserId
    );

    await this.selectSkill(chatId, userId, temporaryUserId);
  };

  // worker city section end

  // worker skills section start

  public selectSkill = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.SKILL,
      temporaryUserInfo?.skillsToWorkers === undefined
        ? []
        : temporaryUserInfo.skillsToWorkers,
      temporaryUserInfo?.categoryItemId === undefined
        ? -1
        : temporaryUserInfo.categoryItemId
    );

    const categoryItem = await this.#categoryItemService.getById(
      temporaryUserInfo.categoryItemId
    );

    const { text, extra } = this.#telegramView.selectSkills(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      [],
      categoryItem as INotPreparedTranslate
    );

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  public checkboxSkill = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number,
    skillId: number,
    typeOperation: 'add' | 'delete'
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    let preparedSkillIds: number[] = [];

    switch (typeOperation) {
      case 'add': {
        preparedSkillIds =
          temporaryUserInfo?.skillsToWorkers === undefined
            ? [skillId]
            : [...temporaryUserInfo.skillsToWorkers, skillId];

        break;
      }
      case 'delete': {
        preparedSkillIds = this.#deleteItemFromArr(
          temporaryUserInfo?.skillsToWorkers === undefined
            ? []
            : temporaryUserInfo.skillsToWorkers,
          skillId
        );

        break;
      }
    }

    await this.updateTemporaryUser(temporaryUserId, {
      type: 'worker',
      skillsToWorkers: preparedSkillIds
    });

    const existSkills = await this.#skillsToCategoryService.getBySkillIds(
      preparedSkillIds
    );

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.SKILL,
      temporaryUserInfo?.skillsToWorkers === undefined
        ? []
        : temporaryUserInfo.skillsToWorkers,
      temporaryUserInfo?.categoryItemId === undefined
        ? -1
        : temporaryUserInfo.categoryItemId
    );

    const categoryItem = await this.#categoryItemService.getById(
      temporaryUserInfo.categoryItemId
    );

    const { text, extra } = this.#telegramView.selectSkills(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      existSkills as INotPreparedTranslate[],
      categoryItem as INotPreparedTranslate
    );

    await this.#telegramApiService.updateMessage(
      chatId,
      messageId,
      text,
      extra
    );
  };

  public saveSkills = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.SKILL,
      temporaryUserInfo?.skillsToWorkers === undefined
        ? []
        : temporaryUserInfo.skillsToWorkers,
      temporaryUserInfo?.categoryItemId === undefined
        ? -1
        : temporaryUserInfo.categoryItemId
    );

    await this.selectSuccess(
      chatId,
      userId,
      messageId,
      notPreparedTranslate,
      ETelegramEditButtonType.SKILL,
      'list',
      temporaryUserId
    );

    await this.selectEmploymentOptions(chatId, userId, temporaryUserId);
  };

  // worker skills section end

  // worker employment options section start

  public selectEmploymentOptions = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      temporaryUserInfo?.employmentOptions === undefined
        ? []
        : temporaryUserInfo.employmentOptions
    );

    const { text, extra } = this.#telegramView.selectEmploymentOptions(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      []
    );

    await this.#telegramApiService.sendMessage(chatId, text, extra);
  };

  public checkboxEmploymentOptions = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number,
    employmentOptionsId: number,
    typeOperation: 'add' | 'delete'
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    let preparedEmploymentOptionIds: number[] = [];

    switch (typeOperation) {
      case 'add': {
        preparedEmploymentOptionIds =
          temporaryUserInfo?.skillsToWorkers === undefined
            ? [employmentOptionsId]
            : [...temporaryUserInfo.skillsToWorkers, employmentOptionsId];

        break;
      }
      case 'delete': {
        preparedEmploymentOptionIds = this.#deleteItemFromArr(
          temporaryUserInfo?.skillsToWorkers === undefined
            ? []
            : temporaryUserInfo.skillsToWorkers,
          employmentOptionsId
        );

        break;
      }
    }

    await this.updateTemporaryUser(temporaryUserId, {
      type: 'worker',
      skillsToWorkers: preparedEmploymentOptionIds
    });

    const existEmploymentOptions =
      await this.#employmentOptionsService.getByIds(
        preparedEmploymentOptionIds
      );

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      temporaryUserInfo?.employmentOptions === undefined
        ? []
        : temporaryUserInfo.employmentOptions
    );

    const { text, extra } = this.#telegramView.selectEmploymentOptions(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      existEmploymentOptions as INotPreparedTranslate[]
    );

    await this.#telegramApiService.updateMessage(
      chatId,
      messageId,
      text,
      extra
    );
  };

  public saveEmploymentOptions = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      temporaryUserInfo?.employmentOptions === undefined
        ? []
        : temporaryUserInfo.employmentOptions
    );

    await this.selectSuccess(
      chatId,
      userId,
      messageId,
      notPreparedTranslate,
      ETelegramEditButtonType.EMPLOYMENT_OPTIONS,
      'list',
      temporaryUserId
    );
  };

  // worker employment options section end

  // worker experience details section start

  public selectExperienceDetails = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.#telegramView.selectExperienceDetails(
      existTelegramInfo.language
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
      telegramMessageType: 'details'
    });
  };

  // worker experience details section end

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
    currentItem: string | INotPreparedTranslate[],
    operationType: ETelegramEditButtonType,
    typeMessage: 'item' | 'list',
    temporaryUserId?: number
  ) => {
    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = await this.#telegramView.selectSuccess(
      existTelegramInfo.language,
      currentItem,
      operationType,
      typeMessage,
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
    operationType: ETelegramEditButtonType,
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
      'item',
      temporaryUserId
    );
  };

  // user edit info section end

  #telegramCheck = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ): Promise<
    | {
        existTelegramInfo: TelegramType;
        existTemporaryUser: TemporaryUserType;
      }
    | undefined
  > => {
    const existTelegramInfo = await this.#getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return undefined;
    }

    const existTemporaryUser = await this.#getTemporaryUserById(
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

  #deleteItemFromArr = (existItems: number[], item: number): number[] => {
    const preparedItems: number[] = [];

    existItems.forEach(it => {
      it === item ? '' : preparedItems.push(it);
    });

    return preparedItems;
  };

  #getPreparedCheckboxItems = async (
    checkboxType: ETelegramCheckboxButtonType,
    existItemIds: number[],
    extraItem?: number
  ): Promise<INotPreparedTranslate[]> => {
    let items: INotPreparedTranslate[];

    switch (checkboxType) {
      case ETelegramCheckboxButtonType.CITY: {
        items = (await this.#cityService.getAll()) as INotPreparedTranslate[];

        break;
      }
      case ETelegramCheckboxButtonType.SKILL: {
        items = (await this.#skillsToCategoryService.getByCategoryId(
          extraItem
        )) as INotPreparedTranslate[];

        break;
      }
      case ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS: {
        items =
          (await this.#employmentOptionsService.getAll()) as INotPreparedTranslate[];

        break;
      }
    }

    return items.map(it =>
      existItemIds.includes(it.id)
        ? { ...it, isExist: true }
        : { ...it, isExist: false }
    );
  };

  #catchError = (err: Error) => {
    this.#logger.warn(err.message);
  };
}
