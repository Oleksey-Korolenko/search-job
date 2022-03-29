import { arrayValuesToType } from '@custom-types/array-values.type';
import { ETelegramMessageType, IWorker } from '@db/tables';
import { DB } from 'drizzle-orm';
import ETelegramCheckboxButtonType from '../enum/checkbox-button-type.enum';
import ETelegramConfirmButtonType from '../enum/confirm-button-type.enum';
import ETelegramEditButtonType from '../enum/edit-button-type.enum';
import { ITelegramMessage } from '../interface';
import TelegramCommonService from './telegram-common.service';
import TelegramMessageService from './telegram-message.service';

export default class TelegramCommandService extends TelegramCommonService {
  #telegramMessagesService: TelegramMessageService;

  constructor(db: DB) {
    super(db);
    this.#telegramMessagesService = new TelegramMessageService(db);
  }

  // ENTERED TEXT SECTION

  public checkEnteredText = async (
    chatId: string,
    userId: string,
    text: string
  ) => {
    const existMessage = await this.telegramMessageService.getByTgInfo(
      userId,
      chatId
    );

    if (existMessage === undefined) {
      return;
    }

    const telegramInfo = await this.telegramCheck(
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
          const salary = this.telegramValidator.salary(text);

          this.updateTemporaryUser(existMessage.temporaryUserId, {
            type: 'worker',
            expectedSalary: salary
          });

          await this.#telegramMessagesService.selectSuccess(
            chatId,
            userId,
            +existMessage.messageId,
            text,
            ETelegramEditButtonType.SALARY,
            'item',
            existMessage.temporaryUserId
          );

          await this.#telegramMessagesService.selectPosition(
            chatId,
            userId,
            existMessage.temporaryUserId
          );

          await this.telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            existMessage.telegramMessageType
          );

          break;
        } catch (e) {
          this.catchError(e);

          await this.telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            existMessage.telegramMessageType
          );

          const { text, extra } = this.telegramView.selectSalary(
            existTelegramInfo.language,
            true,
            ETelegramConfirmButtonType.SALARY
          );

          const result =
            await this.telegramApiService.sendMessage<ITelegramMessage>(
              chatId,
              text,
              extra
            );

          await this.telegramMessageService.save({
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

        await this.#telegramMessagesService.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
          text,
          ETelegramEditButtonType.POSITION,
          'item',
          existMessage.temporaryUserId
        );

        await this.telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        if (existTemporaryUser.userRole === 'worker') {
          await this.#telegramMessagesService.selectEnglishLevel(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        if (existTemporaryUser.userRole === 'employer') {
          await this.#telegramMessagesService.selectCompany(
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

        await this.#telegramMessagesService.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
          text,
          ETelegramEditButtonType.EXPERIENCE_DETAILS,
          'item',
          existMessage.temporaryUserId
        );

        await this.telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        await this.#telegramMessagesService.selectSummary(
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

        await this.#telegramMessagesService.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
          text,
          ETelegramEditButtonType.NAME,
          'item',
          existMessage.temporaryUserId
        );

        await this.telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        if (existTemporaryUser.userRole === 'worker') {
          await this.#telegramMessagesService.selectCategory(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        if (existTemporaryUser.userRole === 'employer') {
          await this.#telegramMessagesService.selectPosition(
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

        await this.#telegramMessagesService.selectSuccess(
          chatId,
          userId,
          +existMessage.messageId,
          text,
          ETelegramEditButtonType.COMPANY,
          'item',
          existMessage.temporaryUserId
        );

        await this.telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        await this.#telegramMessagesService.selectPhone(
          chatId,
          userId,
          existMessage.temporaryUserId
        );

        break;
      }
      case 'skills': {
        const worker = existTemporaryUser.user as IWorker;

        const preparedSkills = text.split(',').map(it => it.trim());

        this.updateTemporaryUser(existMessage.temporaryUserId, {
          type: 'worker',
          skills: [
            ...(worker?.skills === undefined ? [] : worker.skills),
            ...preparedSkills
          ]
        });

        // TODO remove twice skills

        await this.#telegramMessagesService.selectEnterSkills(
          chatId,
          +existMessage.messageId,
          existTelegramInfo.language,
          preparedSkills
        );

        await this.telegramMessageService.deleteByTgInfo(
          userId,
          chatId,
          existMessage.messageId,
          existMessage.telegramMessageType
        );

        await this.#telegramMessagesService.selectSkill(
          chatId,
          userId,
          existMessage.temporaryUserId
        );

        break;
      }
      case 'phone': {
        try {
          const phone = this.telegramValidator.phone(text);

          this.updateTemporaryUser(existMessage.temporaryUserId, {
            type: 'employer',
            phone
          });

          await this.#telegramMessagesService.selectSuccess(
            chatId,
            userId,
            +existMessage.messageId,
            text,
            ETelegramEditButtonType.PHONE,
            'item',
            existMessage.temporaryUserId
          );

          await this.#telegramMessagesService.selectSummary(
            chatId,
            userId,
            existMessage.temporaryUserId,
            'employer'
          );

          await this.telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            existMessage.telegramMessageType
          );

          break;
        } catch (e) {
          this.catchError(e);

          await this.telegramMessageService.deleteByTgInfo(
            userId,
            chatId,
            existMessage.messageId,
            existMessage.telegramMessageType
          );

          const { text, extra } = this.telegramView.selectPhone(
            existTelegramInfo.language,
            true,
            ETelegramConfirmButtonType.PHONE
          );

          const result =
            await this.telegramApiService.sendMessage<ITelegramMessage>(
              chatId,
              text,
              extra
            );

          await this.telegramMessageService.save({
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

  // ENTERED TEXT SECTION

  // BUTTONS SECTION

  public checkYesButton = async (
    chatId: string,
    messageId: number,
    userId: string,
    typeOperation: ETelegramConfirmButtonType
  ) => {
    const existMessage =
      await this.telegramMessageService.getByTgInfoWithOperationType(
        userId,
        chatId,
        typeOperation as arrayValuesToType<typeof ETelegramMessageType.values>
      );

    if (existMessage === undefined) {
      return;
    }

    const telegramInfo = await this.telegramCheck(
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
        const { text, extra } = this.telegramView.selectSalary(
          existTelegramInfo.language,
          false
        );

        await this.telegramApiService.updateMessage<ITelegramMessage>(
          chatId,
          messageId,
          text,
          extra
        );
      }
    }
  };

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
          await this.#telegramMessagesService.saveSkills(
            chatId,
            userId,
            messageId,
            temporaryUserId
          );
        }
        break;
      }
      case ETelegramCheckboxButtonType.EMPLOYMENT_OPTIONS: {
        if (typeOperation === 'save') {
          await this.#telegramMessagesService.saveEmploymentOptions(
            chatId,
            userId,
            messageId,
            temporaryUserId
          );
        } else if (typeOperation === 'add' || typeOperation === 'delete') {
          await this.#telegramMessagesService.checkboxEmploymentOptions(
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

  // BUTTONS SECTION
}
