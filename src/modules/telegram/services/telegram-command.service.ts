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
    this.#telegramMessagesService = new TelegramMessageService(this.db);
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

    console.log(
      userId,
      chatId,
      existMessage.messageId,
      existMessage.telegramMessageType
    );

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

          if (!existTemporaryUser.isEdit) {
            await this.#telegramMessagesService.selectPosition(
              chatId,
              userId,
              existMessage.temporaryUserId
            );
          }

          await this.updateTemporaryUserEditMode(
            existMessage.temporaryUserId,
            false
          );

          break;
        } catch (e) {
          this.catchError(e);

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

        if (
          existTemporaryUser.userRole === 'worker' &&
          !existTemporaryUser.isEdit
        ) {
          await this.#telegramMessagesService.selectEnglishLevel(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        if (
          existTemporaryUser.userRole === 'employer' &&
          !existTemporaryUser.isEdit
        ) {
          await this.#telegramMessagesService.selectCompany(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        await this.updateTemporaryUserEditMode(
          existMessage.temporaryUserId,
          false
        );

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

        if (!existTemporaryUser.isEdit) {
          await this.#telegramMessagesService.selectSummary(
            chatId,
            userId,
            existMessage.temporaryUserId,
            'worker'
          );
        }

        await this.updateTemporaryUserEditMode(
          existMessage.temporaryUserId,
          false
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

        if (
          existTemporaryUser.userRole === 'worker' &&
          !existTemporaryUser.isEdit
        ) {
          await this.#telegramMessagesService.selectCategory(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        if (
          existTemporaryUser.userRole === 'employer' &&
          !existTemporaryUser.isEdit
        ) {
          await this.#telegramMessagesService.selectPosition(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        await this.updateTemporaryUserEditMode(
          existMessage.temporaryUserId,
          false
        );

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

        if (!existTemporaryUser.isEdit) {
          await this.#telegramMessagesService.selectPhone(
            chatId,
            userId,
            existMessage.temporaryUserId
          );
        }

        await this.updateTemporaryUserEditMode(
          existMessage.temporaryUserId,
          false
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

          if (!existTemporaryUser.isEdit) {
            await this.#telegramMessagesService.selectSummary(
              chatId,
              userId,
              existMessage.temporaryUserId,
              'employer'
            );
          }

          await this.updateTemporaryUserEditMode(
            existMessage.temporaryUserId,
            false
          );

          break;
        } catch (e) {
          this.catchError(e);

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

    await this.telegramMessageService.deleteByTgInfo(
      userId,
      existMessage.messageId,
      chatId,
      existMessage.telegramMessageType
    );
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

  public checkEditButton = async (
    chatId: string | number,
    messageId: number,
    userId: string,
    temporaryUserId: number,
    typeOperation: ETelegramEditButtonType
  ) => {
    const telegramInfo = await this.telegramCheck(
      chatId,
      userId,
      temporaryUserId
    );

    if (telegramInfo === undefined) {
      return;
    }

    await this.updateTemporaryUserEditMode(temporaryUserId, true);

    switch (typeOperation) {
      case ETelegramEditButtonType.CATEGORY: {
        await this.#telegramMessagesService.selectCategory(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.COMPANY: {
        await this.#telegramMessagesService.selectCompany(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.EMPLOYMENT_OPTIONS: {
        await this.#telegramMessagesService.selectEmploymentOptions(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.ENGLISH_LEVEL: {
        await this.#telegramMessagesService.selectEnglishLevel(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.EXPERIENCE: {
        await this.#telegramMessagesService.selectExperience(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.EXPERIENCE_DETAILS: {
        await this.#telegramMessagesService.selectExperienceDetails(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.NAME: {
        await this.#telegramMessagesService.selectFullName(
          chatId,
          userId,
          messageId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.PHONE: {
        await this.#telegramMessagesService.selectPhone(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.POSITION: {
        await this.#telegramMessagesService.selectPosition(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.SALARY: {
        await this.#telegramMessagesService.selectSalary(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
      case ETelegramEditButtonType.SKILL: {
        await this.#telegramMessagesService.selectSkill(
          chatId,
          userId,
          temporaryUserId
        );
        break;
      }
    }

    await this.telegramApiService.updateMessageReplyMarkup(
      chatId,
      messageId,
      {}
    );
  };

  // BUTTONS SECTION
}
