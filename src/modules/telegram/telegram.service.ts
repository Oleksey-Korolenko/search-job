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
  IEmployerFinally,
  IInlineKeyboardButton,
  INotPreparedTranslate,
  ITelegramMessage,
  IWorkerFinally
} from './interface';
import TelegramMessageService from '@modules/telegram-messages/telegram-messages.service';
import { TelegramValidate } from './telegram.validator';
import ETelegramConfirmButtonType from './enum/confirm-button-type.enum';
import ETelegramCheckboxButtonType from './enum/checkbox-button-type.enum';
import ETelegramEditButtonType from './enum/edit-button-type.enum';
import EmploymentOptionsService from '@modules/employment-options/employment-options.service';
import { languageTypes } from './messages';

export default class TelegramService extends DBConnection {
  #telegramApiService: TelegramApiService;
  #telegramView: TelegramView;
  #telegramValidator: TelegramValidate;

  #telegramDBService: TelegramDBProcessorService;
  #temporaryUserService: TemporaryUserService;
  #telegramMessageService: TelegramMessageService;

  #categoryService: CategoryService;
  #categoryItemService: CategoryItemService;
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
    this.#employmentOptionsService = new EmploymentOptionsService(this.db);

    this.#logger = new LoggerService().getLogger();
  }

  // check text command start

  public checkCommand = async (
    chatId: string,
    userId: string,
    text: string
  ) => {
    console.log(1);

    const existMessage = await this.#telegramMessageService.getByTgInfo(
      userId,
      chatId
    );

    console.log(2);
    console.log(userId, chatId);
    console.log(existMessage);

    if (existMessage === undefined) {
      return;
    }

    const telegramInfo = await this.#telegramCheck(
      chatId,
      userId,
      existMessage.temporaryUserId
    );

    console.log(3);

    if (telegramInfo === undefined) {
      return;
    }

    console.log(
      telegramInfo.existTelegramInfo,
      telegramInfo.existTemporaryUser
    );

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
            +existMessage.messageId,
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
            chatId: `${chatId}`,
            userId: `${userId}`,
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
          +existMessage.messageId,
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

        if (existTemporaryUser.userRole === 'worker') {
          await this.selectEnglishLevel(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        if (existTemporaryUser.userRole === 'employer') {
          await this.selectCompany(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        break;
      }
      case 'details': {
        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: 'worker',
          workExperienceDetails: text
        });

        await this.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
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

        await this.selectFinnalyResult(
          chatId,
          userId,
          existMessage.temporaryUserId,
          'worker'
        );

        break;
      }
      case 'name': {
        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: existTemporaryUser.user.type,
          name: text
        });

        await this.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
          text,
          ETelegramEditButtonType.NAME,
          'item',
          existMessage.temporaryUserId
        );

        await this.#telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        if (existTemporaryUser.userRole === 'worker') {
          await this.selectCategory(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        if (existTemporaryUser.userRole === 'employer') {
          await this.selectPosition(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        break;
      }
      case 'company': {
        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: 'employer',
          company: text
        });

        await this.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
          text,
          ETelegramEditButtonType.COMPANY,
          'item',
          existMessage.temporaryUserId
        );

        await this.#telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        await this.selectPhone(chatId, userId, existMessage.temporaryUserId);

        break;
      }
      case 'skills': {
        const worker = existTemporaryUser.user as IWorker;

        const preparedSkills = text.split(',').map(it => it.trim());

        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: 'worker',
          skills: [...worker.skills, ...preparedSkills]
        });

        await this.selectEnterSkills(
          chatId,
          +existMessage.messageId,
          existTelegramInfo.language,
          preparedSkills
        );

        await this.#telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        await this.selectSkill(chatId, userId, existMessage.temporaryUserId);

        break;
      }
      case 'phone': {
        try {
          const phone = this.#telegramValidator.phone(text);

          this.updateTemporaryUser(existMessage.temporaryUserId, {
            type: 'employer',
            phone
          });

          await this.selectSuccess(
            chatId,
            userId,
            +existMessage.messageId,
            text,
            ETelegramEditButtonType.PHONE,
            'item',
            existMessage.temporaryUserId
          );

          await this.selectFinnalyResult(
            chatId,
            userId,
            existMessage.temporaryUserId,
            'employer'
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

          const { text, extra } = this.#telegramView.selectPhone(
            existTelegramInfo.language,
            true,
            ETelegramConfirmButtonType.PHONE
          );

          const result =
            await this.#telegramApiService.sendMessage<ITelegramMessage>(
              chatId,
              text,
              extra
            );

          await this.#telegramMessageService.save({
            chatId: `${chatId}`,
            userId: `${userId}`,
            messageId: `${result.result.message_id}`,
            temporaryUserId: existMessage.temporaryUserId,
            telegramMessageType: 'phone'
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
      case ETelegramCheckboxButtonType.SKILL: {
        if (typeOperation === 'save') {
          await this.saveSkills(chatId, userId, messageId, temporaryUserId);
        }
        break;
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
        break;
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
    userId: string,
    messageId: number,
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
          await this.selectFullName(
            chatId,
            userId,
            messageId,
            temporaryUser.id
          );
          return temporaryUser.id;
        }
        case 'employer': {
          const temporaryUser = await this.#saveTemporaryUser({
            isReadyToSave: false,
            userRole: 'employer',
            telegramUserId: existTelegramInfo.id,
            user: {
              type: 'employer'
            }
          });
          await this.selectFullName(
            chatId,
            userId,
            messageId,
            temporaryUser.id
          );
          return temporaryUser.id;
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
  ): Promise<TemporaryUserType | undefined> => {
    const temporaryUser = await this.#temporaryUserService.getById(
      temporaryUserId
    );

    return await this.#temporaryUserService.updateUser(temporaryUser.id, {
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
      chatId: `${chatId}`,
      userId: `${userId}`,
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
      chatId: `${chatId}`,
      userId: `${userId}`,
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

  // worker skills section start

  public selectEnterSkills = async (
    chatId: number | string,
    messageId: number,
    language: languageTypes,
    skills: string[]
  ) => {
    const text = this.#telegramView.showEnterSkills(language, skills);

    await this.#telegramApiService.updateMessage(chatId, messageId, text);
  };

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

    const categoryItem = await this.#categoryItemService.getById(
      temporaryUserInfo.categoryItemId
    );

    const { text, extra } = this.#telegramView.selectSkills(
      existTelegramInfo.language,
      temporaryUserId,
      temporaryUserInfo?.skills === undefined ? [] : temporaryUserInfo.skills,
      categoryItem as INotPreparedTranslate
    );

    const result = await this.#telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.#telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'skills'
    });
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

    const text =
      '\n\n' + temporaryUserInfo.skills.map(it => it + '\n').join('');

    await this.selectSuccess(
      chatId,
      userId,
      messageId,
      text,
      ETelegramEditButtonType.SKILL,
      'item',
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
          temporaryUserInfo?.employmentOptions === undefined
            ? [employmentOptionsId]
            : [...temporaryUserInfo.employmentOptions, employmentOptionsId];

        break;
      }
      case 'delete': {
        preparedEmploymentOptionIds = this.#deleteItemFromArr(
          temporaryUserInfo?.employmentOptions === undefined
            ? []
            : temporaryUserInfo.employmentOptions,
          employmentOptionsId
        );

        break;
      }
    }

    const updatedTemporaryUser = await this.updateTemporaryUser(
      temporaryUserId,
      {
        type: 'worker',
        employmentOptions: preparedEmploymentOptionIds
      }
    );

    const updatedTemporaryUserInfo = updatedTemporaryUser.user as IWorker;

    const existEmploymentOptions =
      await this.#employmentOptionsService.getByIds(
        preparedEmploymentOptionIds
      );

    const notPreparedTranslate = await this.#getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      updatedTemporaryUserInfo?.employmentOptions === undefined
        ? []
        : updatedTemporaryUserInfo.employmentOptions
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

    const existEmploymentOptions =
      await this.#employmentOptionsService.getByIds(
        temporaryUserInfo.employmentOptions
      );

    await this.selectSuccess(
      chatId,
      userId,
      messageId,
      existEmploymentOptions as INotPreparedTranslate[],
      ETelegramEditButtonType.EMPLOYMENT_OPTIONS,
      'list',
      temporaryUserId
    );

    await this.selectExperienceDetails(chatId, userId, temporaryUserId);
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
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'details'
    });
  };

  // worker experience details section end

  // user full name section start

  public selectFullName = async (
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

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.#telegramView.selectFullName(
      existTelegramInfo.language
    );

    const result =
      await this.#telegramApiService.updateMessage<ITelegramMessage>(
        chatId,
        messageId,
        text,
        extra
      );

    await this.#telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'name'
    });
  };

  // user full name section end

  // employer company section start

  public selectCompany = async (
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

    const { text, extra } = this.#telegramView.selectCompany(
      existTelegramInfo.language
    );

    const result = await this.#telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.#telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'company'
    });
  };

  // employer company section end

  // employer phone section start

  public selectPhone = async (
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

    const { text, extra } = this.#telegramView.selectPhone(
      existTelegramInfo.language,
      false
    );

    const result = await this.#telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.#telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'phone'
    });
  };

  // employer phone section end

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

  // user finally result section start

  public selectFinnalyResult = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    userRole: 'worker' | 'employer'
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

    if (userRole === 'worker') {
      const worker = existTemporaryUser.user as IWorker;

      const category = await this.#categoryItemService.getById(
        worker.categoryItemId
      );

      const employmentOptions = await this.#employmentOptionsService.getByIds(
        worker.employmentOptions
      );

      const finallyWorker = {
        name: worker.name,
        categoryItem: category,
        workExperience: worker.workExperience,
        expectedSalary: worker.expectedSalary,
        position: worker.position,
        englishLevel: worker.englishLevel,
        workExperienceDetails: worker.workExperienceDetails,
        skills: worker.skills,
        employmentOptions
      } as IWorkerFinally;

      const { text, extra } = this.#telegramView.selectFinallyWorker(
        existTelegramInfo.language,
        finallyWorker,
        temporaryUserId
      );

      await this.#telegramApiService.sendMessage(chatId, text, extra);
    }

    if (userRole === 'employer') {
      const employer = existTemporaryUser.user as IEmployer;

      const finallyEmployer = {
        name: employer.name,
        company: employer.company,
        position: employer.position,
        phone: employer.phone
      } as IEmployerFinally;

      const { text, extra } = this.#telegramView.selectFinallyEmployer(
        existTelegramInfo.language,
        finallyEmployer,
        temporaryUserId
      );

      await this.#telegramApiService.sendMessage(chatId, text, extra);
    }
  };

  // user finally result section end

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
    existItemIds: number[]
  ): Promise<INotPreparedTranslate[]> => {
    let items: INotPreparedTranslate[];

    switch (checkboxType) {
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
