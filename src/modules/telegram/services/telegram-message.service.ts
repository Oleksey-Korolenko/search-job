import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole, IEmployer, IWorker } from '@db/tables';
import { IEmployerInput } from '@modules/employer';
import { IWorkerInput } from '@modules/worker';
import { DB } from 'drizzle-orm';
import e from 'express';
import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import ETelegramEditButtonType from '../enum/edit-button-type.enum';
import {
  IEmployerFinally,
  IInlineKeyboardButton,
  INotPreparedTranslate,
  ITelegramMessage,
  ITelegramTextFormatterExtra,
  IWorkerFinally
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCommonService from './telegram-common.service';

export default class TelegramMessageService extends TelegramCommonService {
  constructor(db: DB) {
    super(db);
  }

  // LANGUAGE SECTION

  public selectLanguage = async (chatId: number | string) =>
    this.startMessage(chatId);

  // LANGUAGE SECTION

  // ROLE SECTION

  public actionForRole = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    role: arrayValuesToType<typeof EUserRole.values>
  ) => {
    try {
      const existTelegramInfo = await this.getTelegramUser(userId, chatId);

      if (existTelegramInfo === undefined) {
        return;
      }

      switch (role) {
        case 'worker': {
          const temporaryUser = await this.saveTemporaryUser({
            isFinal: -1,
            userRole: 'worker',
            telegramUserId: existTelegramInfo.id,
            user: {
              type: 'worker'
            },
            isEdit: false
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
          const temporaryUser = await this.saveTemporaryUser({
            isFinal: -1,
            userRole: 'employer',
            telegramUserId: existTelegramInfo.id,
            user: {
              type: 'employer'
            },
            isEdit: false
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
      this.catchError(e);
    }
  };

  public selectRole = async (
    chatId: number | string,
    messageId: number,
    userId: string
  ) => {
    const existTelegramInfo = await this.getTelegramUser(userId, chatId);

    if (existTelegramInfo === undefined) {
      return;
    }

    const worker = await this.workerService.getByTelegramId(
      existTelegramInfo.id
    );

    const employer = await this.employerService.getByTelegramId(
      existTelegramInfo.id
    );

    if (employer !== undefined && worker !== undefined) {
      await this.existAccountError(
        chatId,
        messageId,
        existTelegramInfo.language
      );
      return;
    }

    const { text, extra } = this.telegramView.selectRole(
      existTelegramInfo.language,
      worker === undefined ? true : false,
      employer === undefined ? true : false
    );

    await this.telegramApiService.updateMessage(chatId, messageId, text, extra);
  };

  // ROLE SECTION

  // CATEGORY SECTION

  public selectCategory = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number,
    isUpdate: boolean
  ) => {
    try {
      const telegramInfo = await this.telegramCheck(
        chatId,
        userId,
        temporaryUserId,
        messageId
      );

      if (telegramInfo === undefined) {
        return;
      }

      const { existTelegramInfo } = telegramInfo;

      const categories = await this.categoryService.getAll();

      const { text, extra } = this.telegramView.selectCategory(
        existTelegramInfo.language,
        categories,
        temporaryUserId
      );

      if (!isUpdate) {
        await this.telegramApiService.sendMessage(chatId, text, extra);
      } else {
        await this.telegramApiService.updateMessage(
          chatId,
          messageId,
          text,
          extra
        );
      }
    } catch (e) {
      this.catchError(e);
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
      const telegramInfo = await this.telegramCheck(
        chatId,
        userId,
        temporaryUserId,
        messageId
      );

      if (telegramInfo === undefined) {
        return;
      }

      const { existTelegramInfo } = telegramInfo;

      const category = await this.categoryService.getById(categoryId);

      const categoryItems = await this.categoryItemService.getByCategoryId(
        categoryId
      );

      const { text, extra } = this.telegramView.selectCategoryItem(
        existTelegramInfo.language,
        category,
        categoryItems,
        temporaryUserId
      );

      await this.telegramApiService.updateMessage(
        chatId,
        messageId,
        text,
        extra
      );
    } catch (e) {
      this.catchError(e);
    }
  };

  // CATEGORY SECTION

  // EXPERIENCE SECTION

  public selectExperience = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.telegramView.selectExperience(
      existTelegramInfo.language,
      temporaryUserId
    );

    await this.telegramApiService.sendMessage(chatId, text, extra);
  };

  // EXPERIENCE SECTION

  // SALARY SECTION

  public selectSalary = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.telegramView.selectSalary(
      existTelegramInfo.language,
      false
    );

    const result = await this.telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'salary'
    });
  };

  // SALARY SECTION

  // POSITION SECTION

  public selectPosition = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const { text, extra } = this.telegramView.selectPosition(
      existTelegramInfo.language,
      existTemporaryUser.userRole
    );

    const result = await this.telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'position'
    });
  };

  // POSITION SECTION

  // ENGLISH LEVEL SECTION

  public selectEnglishLevel = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.telegramView.selectEnglishLevel(
      existTelegramInfo.language,
      temporaryUserId
    );

    await this.telegramApiService.sendMessage(chatId, text, extra);
  };

  // ENGLISH LEVEL SECTION

  // SKILLS SECTION

  public selectEnterSkills = async (
    chatId: number | string,
    messageId: number,
    language: languageTypes,
    skills: string[]
  ) => {
    const text = this.telegramView.showEnterSkills(language, skills);

    await this.telegramApiService.updateMessage(chatId, messageId, text);
  };

  public selectSkill = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const categoryItem = await this.categoryItemService.getById(
      temporaryUserInfo.categoryItemId
    );

    const { text, extra } = this.telegramView.selectSkills(
      existTelegramInfo.language,
      temporaryUserId,
      temporaryUserInfo?.skills === undefined ? [] : temporaryUserInfo.skills,
      categoryItem as INotPreparedTranslate
    );

    const result = await this.telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.telegramMessageService.save({
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
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
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

    if (!existTemporaryUser.isEdit) {
      await this.selectEmploymentOptions(
        chatId,
        userId,
        temporaryUserId,
        messageId
      );
    } else {
      await this.updateTemporaryUserEditOptions(temporaryUserId, false, -1);
    }

    if (existTemporaryUser.isFinal === 0) {
      await this.selectSummary(chatId, userId, existTemporaryUser.id, false);
    }

    await this.telegramMessageService.deleteByTgInfo(
      userId,
      `${messageId}`,
      `${chatId}`,
      'skills'
    );
  };

  // SKILLS SECTION

  // EMPLOYMENT OPTIONS SECTION

  public selectEmploymentOptions = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const notPreparedTranslate = await this.getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      temporaryUserInfo?.employmentOptions === undefined
        ? []
        : temporaryUserInfo.employmentOptions
    );

    const { text, extra } = this.telegramView.selectEmploymentOptions(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      []
    );

    await this.telegramApiService.sendMessage(chatId, text, extra);
  };

  public checkboxEmploymentOptions = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number,
    employmentOptionsId: number,
    typeOperation: 'add' | 'delete'
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
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
        preparedEmploymentOptionIds = this.deleteItemFromArr(
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

    const existEmploymentOptions = await this.employmentOptionsService.getByIds(
      preparedEmploymentOptionIds
    );

    const notPreparedTranslate = await this.getPreparedCheckboxItems(
      ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS,
      updatedTemporaryUserInfo?.employmentOptions === undefined
        ? []
        : updatedTemporaryUserInfo.employmentOptions
    );

    const { text, extra } = this.telegramView.selectEmploymentOptions(
      existTelegramInfo.language,
      temporaryUserId,
      notPreparedTranslate,
      existEmploymentOptions as INotPreparedTranslate[]
    );

    await this.telegramApiService.updateMessage(chatId, messageId, text, extra);
  };

  public saveEmploymentOptions = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTemporaryUser } = telegramInfo;

    const temporaryUserInfo = existTemporaryUser.user as IWorker;

    const existEmploymentOptions = await this.employmentOptionsService.getByIds(
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

    if (existTemporaryUser.isEdit) {
      await this.updateTemporaryUserEditOptions(temporaryUserId, false, -1);
    } else {
      await this.selectExperienceDetails(
        chatId,
        userId,
        temporaryUserId,
        messageId
      );
    }

    if (existTemporaryUser.isFinal === 0) {
      await this.selectSummary(chatId, userId, existTemporaryUser.id, false);
    }
  };

  // EMPLOYMENT OPTIONS SECTION

  // EXPERIENCE DETAILS SECTION

  public selectExperienceDetails = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.telegramView.selectExperienceDetails(
      existTelegramInfo.language
    );

    const result = await this.telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'details'
    });
  };

  // EXPERIENCE DETAILS SECTION

  // NAME SECTION

  public selectFullName = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    const { text, extra } = this.telegramView.selectFullName(
      existTelegramInfo.language
    );

    let result;

    if (!existTemporaryUser.isEdit) {
      result = await this.telegramApiService.updateMessage<ITelegramMessage>(
        chatId,
        messageId,
        text,
        extra
      );
    } else {
      result = await this.telegramApiService.sendMessage<ITelegramMessage>(
        chatId,
        text,
        extra
      );
    }

    await this.telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'name'
    });
  };

  // NAME SECTION

  // COMPANY SECTION

  public selectCompany = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.telegramView.selectCompany(
      existTelegramInfo.language
    );

    const result = await this.telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'company'
    });
  };

  // COMPANY SECTION

  // PHONE SECTION

  public selectPhone = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = this.telegramView.selectPhone(
      existTelegramInfo.language,
      false
    );

    const result = await this.telegramApiService.sendMessage<ITelegramMessage>(
      chatId,
      text,
      extra
    );

    await this.telegramMessageService.save({
      chatId: `${chatId}`,
      userId: `${userId}`,
      messageId: `${result.result.message_id}`,
      temporaryUserId,
      telegramMessageType: 'phone'
    });
  };

  // PHONE SECTION

  // SUCCESS MESSAGE SECTION

  public selectSuccess = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    currentItem: string | INotPreparedTranslate[],
    operationType: ETelegramEditButtonType,
    typeMessage: 'item' | 'list',
    temporaryUserId?: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo } = telegramInfo;

    const { text, extra } = await this.telegramView.selectSuccess(
      existTelegramInfo.language,
      currentItem,
      operationType,
      typeMessage,
      temporaryUserId
    );

    await this.telegramApiService.updateMessage(chatId, messageId, text, extra);
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

  // SUCCESS MESSAGE SECTION

  // SUMMARY SECTION

  public selectSummary = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    isEdit: boolean,
    messageId?: number
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    let text = '';
    let extra: ITelegramTextFormatterExtra = {};

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    if (existTemporaryUser.userRole === 'worker') {
      const worker = existTemporaryUser.user as IWorker;

      const category = await this.categoryItemService.getById(
        worker.categoryItemId
      );

      const employmentOptions = await this.employmentOptionsService.getByIds(
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

      const tgMessage = this.telegramView.selectWorkerSummary(
        existTelegramInfo.language,
        finallyWorker,
        temporaryUserId,
        isEdit
      );

      text = tgMessage.text;
      extra = tgMessage.extra;
    }

    if (existTemporaryUser.userRole === 'employer') {
      const employer = existTemporaryUser.user as IEmployer;

      const finallyEmployer = {
        name: employer.name,
        company: employer.company,
        position: employer.position,
        phone: employer.phone
      } as IEmployerFinally;

      const tgMessage = this.telegramView.selectEmployerSummary(
        existTelegramInfo.language,
        finallyEmployer,
        temporaryUserId,
        isEdit
      );

      text = tgMessage.text;
      extra = tgMessage.extra;
    }

    if (messageId === undefined) {
      await this.telegramApiService.sendMessage(chatId, text, extra);
    } else {
      await this.telegramApiService.updateMessage(
        chatId,
        messageId,
        text,
        extra
      );
    }
  };

  public saveSummary = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number,
    userRole: arrayValuesToType<typeof EUserRole.values>
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

    if (telegramInfo === undefined) {
      return;
    }

    const { existTelegramInfo, existTemporaryUser } = telegramInfo;

    let text = '';

    if (userRole === 'worker') {
      const worker = existTemporaryUser.user as IWorker;

      const preparedWorker: IWorkerInput = {
        name: worker.name,
        categoryItemId: worker.categoryItemId,
        workExperience: worker.workExperience,
        expectedSalary: worker.expectedSalary,
        position: worker.position,
        englishLevel: worker.englishLevel,
        workExperienceDetails: worker.workExperienceDetails,
        skills: worker.skills,
        telegramUserId: existTelegramInfo.id
      };

      const savedWorker = await this.workerService.save(preparedWorker);

      await this.employmentOptionsService.addedEmploymentOptionsToWorker(
        savedWorker.id,
        worker.employmentOptions
      );

      text = this.telegramView.saveSummary(
        existTelegramInfo.language,
        'worker'
      );
    }

    if (userRole === 'employer') {
      const employer = existTemporaryUser.user as IEmployer;

      const preparedEmployer: IEmployerInput = {
        name: employer.name,
        company: employer.company,
        position: employer.position,
        phone: employer.phone,
        telegramUserId: existTelegramInfo.id
      };

      await this.employerService.save(preparedEmployer);

      text = this.telegramView.saveSummary(
        existTelegramInfo.language,
        'employer'
      );
    }

    await this.telegramApiService.sendMessage(chatId, text);

    await this.telegramApiService.updateMessageReplyMarkup(
      chatId,
      messageId,
      {}
    );

    await this.temporaryUserService.deleteTemporaryUser(existTemporaryUser.id);
  };

  // SUMMARY SECTION

  // TEMPORARY USER ERROR

  public temporaryUserYesButton = async (
    chatId: string,
    messageId: number,
    userId: string
  ) => {
    const telegramUser = await this.getTelegramUser(userId, chatId);

    const temporaryUserByUserId = await this.temporaryUserService.getByUserId(
      userId
    );

    const worker = await this.workerService.getByTelegramId(telegramUser.id);

    const employer = await this.employerService.getByTelegramId(
      telegramUser.id
    );

    if (worker !== undefined && employer !== undefined) {
      await this.existAccountError(chatId, messageId, telegramUser.language);
      return;
    }

    if (temporaryUserByUserId.length === 1) {
      switch (temporaryUserByUserId[0].userRole) {
        case 'employer': {
          if (employer !== undefined) {
            await this.existAccountError(
              chatId,
              messageId,
              telegramUser.language
            );
            return;
          }
          const temporaryUser = await this.saveTemporaryUser({
            isFinal: -1,
            userRole: 'worker',
            telegramUserId: telegramUser.id,
            user: {
              type: 'worker'
            },
            isEdit: false
          });
          await this.selectFullName(
            chatId,
            userId,
            messageId,
            temporaryUser.id
          );
          break;
        }
        case 'worker': {
          if (worker !== undefined) {
            await this.existAccountError(
              chatId,
              messageId,
              telegramUser.language
            );
            return;
          }
          const temporaryUser = await this.saveTemporaryUser({
            isFinal: -1,
            userRole: 'employer',
            telegramUserId: telegramUser.id,
            user: {
              type: 'employer'
            },
            isEdit: false
          });
          await this.selectFullName(
            chatId,
            userId,
            messageId,
            temporaryUser.id
          );
          break;
        }
      }
    } else if (employer !== undefined) {
      const temporaryUser = await this.saveTemporaryUser({
        isFinal: -1,
        userRole: 'worker',
        telegramUserId: telegramUser.id,
        user: {
          type: 'worker'
        },
        isEdit: false
      });
      await this.selectFullName(chatId, userId, messageId, temporaryUser.id);
    } else if (worker !== undefined) {
      const temporaryUser = await this.saveTemporaryUser({
        isFinal: -1,
        userRole: 'employer',
        telegramUserId: telegramUser.id,
        user: {
          type: 'employer'
        },
        isEdit: false
      });
      await this.selectFullName(chatId, userId, messageId, temporaryUser.id);
    } else {
      await this.selectRole(chatId, messageId, userId);
    }

    return;
  };

  public temporaryUserNoButton = async (
    chatId: string,
    messageId: number,
    userId: string
  ) => {
    const telegramUser = await this.getTelegramUser(userId, chatId);

    const text = this.telegramView.clearMessageMain(telegramUser.language);

    await this.telegramApiService.updateMessage<ITelegramMessage>(
      chatId,
      messageId,
      text
    );
  };

  // TEMPORARY USER ERROR

  // ERROR

  public existAccountError = async (
    chatId: string | number,
    messageId: number,
    language: languageTypes
  ) => {
    const text = this.telegramView.selectExistAccError(language);

    await this.telegramApiService.updateMessage<ITelegramMessage>(
      chatId,
      messageId,
      text
    );
  };

  // ERROR
}
