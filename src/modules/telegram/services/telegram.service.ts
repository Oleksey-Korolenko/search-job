import { arrayValuesToType } from '@custom-types/array-values.type';
import { EUserRole, IEmployer, IWorker, TemporaryUserType } from '@db/tables';
import { ITelegramDBInput } from '@modules/telegram-db-processor';
import { DB } from 'drizzle-orm';
import ETelegramBackButtonType from '../enum/back-button-type.enum';
import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import ETelegramConfirmButtonType from '../enum/confirm-button-type.enum';
import ETelegramEditButtonType from '../enum/edit-button-type.enum';
import { IInlineKeyboardButton } from '../interface';
import TelegramCommandService from './telegram-command.service';
import TelegramCommonService from './telegram-common.service';
import TelegramMessageService from './telegram-message.service';

export class TelegramService extends TelegramCommonService {
  #messageService: TelegramMessageService;
  #commandService: TelegramCommandService;

  constructor(db: DB) {
    super(db);
    this.#messageService = new TelegramMessageService(this.db);
    this.#commandService = new TelegramCommandService(this.db);
  }

  // MESSAGE MODULE

  public selectLanguage = async (chatId: number | string) =>
    this.#messageService.selectLanguage(chatId);

  public actionForRole = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    role: arrayValuesToType<typeof EUserRole.values>
  ) => this.#messageService.actionForRole(chatId, userId, messageId, role);

  public selectRole = async (
    chatId: number | string,
    messageId: number,
    userId: string
  ) => this.#messageService.selectRole(chatId, messageId, userId);

  public selectCategory = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    messageId?: number
  ) =>
    this.#messageService.selectCategory(
      chatId,
      userId,
      temporaryUserId,
      messageId
    );

  public selectCategoryItems = async (
    chatId: number | string,
    messageId: number,
    userId: string,
    categoryId: number,
    temporaryUserId: number
  ) =>
    this.#messageService.selectCategoryItems(
      chatId,
      messageId,
      userId,
      categoryId,
      temporaryUserId
    );

  public selectExperience = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => this.#messageService.selectExperience(chatId, userId, temporaryUserId);

  public selectSalary = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => this.#messageService.selectSalary(chatId, userId, temporaryUserId);

  // TODO clear all
  public selectSkill = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number
  ) => this.#messageService.selectSkill(chatId, userId, temporaryUserId);

  public selectSuccessWithInlineKeyboard = (
    chatId: number | string,
    userId: string,
    messageId: number,
    data: string,
    inlineKeyboard: IInlineKeyboardButton[][],
    operationType: ETelegramEditButtonType,
    temporaryUserId?: number
  ) =>
    this.#messageService.selectSuccessWithInlineKeyboard(
      chatId,
      userId,
      messageId,
      data,
      inlineKeyboard,
      operationType,
      temporaryUserId
    );

  public selectSummary = async (
    chatId: number | string,
    userId: string,
    temporaryUserId: number,
    isEdit: boolean,
    messageId?: number
  ) =>
    this.#messageService.selectSummary(
      chatId,
      userId,
      temporaryUserId,
      isEdit,
      messageId
    );

  public saveSummary = async (
    chatId: number | string,
    userId: string,
    messageId: number,
    temporaryUserId: number,
    userRole: arrayValuesToType<typeof EUserRole.values>
  ) =>
    this.#messageService.saveSummary(
      chatId,
      userId,
      messageId,
      temporaryUserId,
      userRole
    );

  // MESSAGE MODULE

  // COMMAND MODULE

  public checkEnteredText = async (
    chatId: string,
    userId: string,
    text: string
  ) => this.#commandService.checkEnteredText(chatId, userId, text);

  public checkCheckboxButton = async (
    chatId: string | number,
    messageId: number,
    userId: string,
    temporaryUserId: number,
    typeMessage: ETelegramCheckboxButtonType,
    typeOperation: 'add' | 'delete' | 'save',
    item: number
  ) =>
    this.#commandService.checkCheckboxButton(
      chatId,
      messageId,
      userId,
      temporaryUserId,
      typeMessage,
      typeOperation,
      item
    );

  public checkYesButton = async (
    chatId: string,
    messageId: number,
    userId: string,
    typeOperation: ETelegramConfirmButtonType
  ) =>
    this.#commandService.checkYesButton(
      chatId,
      messageId,
      userId,
      typeOperation
    );

  public checkEditButton = async (
    chatId: string | number,
    messageId: number,
    userId: string,
    temporaryUserId: number,
    typeOperation: ETelegramEditButtonType
  ) =>
    this.#commandService.checkEditButton(
      chatId,
      messageId,
      userId,
      temporaryUserId,
      typeOperation
    );

  public checkBackButton = async (
    chatId: string | number,
    messageId: number,
    userId: string,
    temporaryUserId: number,
    typeMessage: ETelegramBackButtonType
  ) =>
    this.#commandService.checkBackButton(
      chatId,
      messageId,
      userId,
      temporaryUserId,
      typeMessage
    );

  // COMMAND MODULE

  // COMMON MODULE

  public saveTelegramInfoMain = async (telegramInfo: ITelegramDBInput) =>
    this.saveTelegramInfo(telegramInfo);

  public updateTemporaryUserMain = async (
    temporaryUserId: number,
    user: IWorker | IEmployer
  ): Promise<TemporaryUserType | undefined> =>
    this.updateTemporaryUser(temporaryUserId, user);

  public updateTemporaryUserEditOptionsMain = async (
    temporaryUserId: number,
    isEdit: boolean,
    isFinal: number
  ) => this.updateTemporaryUserEditOptions(temporaryUserId, isEdit, isFinal);

  // COMMON MODULE
}
