import { arrayValuesToType } from '@custom-types/array-values.type';
import { CategoryItemType, CategoryType, EUserRole } from '@db/tables';
import ETelegramConfirmButtonType from '../enum/confirm-button-type.enum';
import ETelegramEditButtonType from '../enum/edit-button-type.enum';
import {
  IEmployerFinally,
  INotPreparedTranslate,
  ITelegramTextFormatterResponse,
  IWorkerFinally
} from '../interface';
import { languageTypes } from '../messages';
import TelegramCategoryView from './telegram-category.view';
import TelegramCommonView from './telegram-common.view';
import TelegramCompanyView from './telegram-company.view';
import TelegramEmploymentOptionsView from './telegram-employment-options.view';
import TelegramEnglishLevelView from './telegram-english-level.view';
import TelegramExperienceDetailsView from './telegram-experience-details.view';
import TelegramExperienceView from './telegram-experience.view';
import TelegramLanguageView from './telegram-language.view';
import TelegramPhoneView from './telegram-phone.view';
import TelegramPositionView from './telegram-position.view';
import TelegramSalaryView from './telegram-salary.view';
import TelegramSkillsView from './telegram-skills.view';
import TelegramSuccessView from './telegram-success.view';
import TelegramSummaryView from './telegram-summary.view';
import TelegramTemporaryUserView from './telegram-temporary-user.view';
import TelegramUserRoleView from './telegram-user-role.view';
import TelegramUsernameView from './telegram-username.view';

export class TelegramView extends TelegramCommonView {
  #usernameView: TelegramUsernameView;
  #categoryView: TelegramCategoryView;
  #experienceView: TelegramExperienceView;
  #salaryView: TelegramSalaryView;
  #positionView: TelegramPositionView;
  #englishLevelView: TelegramEnglishLevelView;
  #skillsView: TelegramSkillsView;
  #employmentOptionsView: TelegramEmploymentOptionsView;
  #experienceDetails: TelegramExperienceDetailsView;
  #companyView: TelegramCompanyView;
  #phoneView: TelegramPhoneView;
  #userRoleView: TelegramUserRoleView;
  #languageView: TelegramLanguageView;
  #summaryView: TelegramSummaryView;
  #successView: TelegramSuccessView;
  #temporaryUserView: TelegramTemporaryUserView;

  constructor() {
    super();
    this.#usernameView = new TelegramUsernameView();
    this.#categoryView = new TelegramCategoryView();
    this.#experienceView = new TelegramExperienceView();
    this.#salaryView = new TelegramSalaryView();
    this.#positionView = new TelegramPositionView();
    this.#englishLevelView = new TelegramEnglishLevelView();
    this.#skillsView = new TelegramSkillsView();
    this.#employmentOptionsView = new TelegramEmploymentOptionsView();
    this.#experienceDetails = new TelegramExperienceDetailsView();
    this.#companyView = new TelegramCompanyView();
    this.#phoneView = new TelegramPhoneView();
    this.#userRoleView = new TelegramUserRoleView();
    this.#languageView = new TelegramLanguageView();
    this.#summaryView = new TelegramSummaryView();
    this.#successView = new TelegramSuccessView();
    this.#temporaryUserView = new TelegramTemporaryUserView();
  }

  // USERNAME VIEW

  public selectFullName = (
    language: languageTypes
  ): ITelegramTextFormatterResponse =>
    this.#usernameView.selectFullName(language);

  // USERNAME VIEW

  // CATEGORY VIEW

  public selectCategory = (
    language: languageTypes,
    categories: CategoryType[],
    temporaryUserId: number
  ): ITelegramTextFormatterResponse =>
    this.#categoryView.selectCategory(language, categories, temporaryUserId);

  public selectCategoryItem = (
    language: languageTypes,
    category: CategoryType,
    categoryItems: CategoryItemType[],
    temporaryUserId: number
  ): ITelegramTextFormatterResponse =>
    this.#categoryView.selectCategoryItem(
      language,
      category,
      categoryItems,
      temporaryUserId
    );

  // CATEGORY VIEW

  // EXPERIENCE VIEW

  public selectExperience = (
    language: languageTypes,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse =>
    this.#experienceView.selectExperience(language, temporaryUserId);

  // EXPERIENCE VIEW

  // SALARY VIEW

  public selectSalary = (
    language: languageTypes,
    isError: boolean,
    operationType?: ETelegramConfirmButtonType
  ): ITelegramTextFormatterResponse =>
    this.#salaryView.selectSalary(language, isError, operationType);

  // SALARY VIEW

  // POSITION VIEW

  public selectPosition = (
    language: languageTypes
  ): ITelegramTextFormatterResponse =>
    this.#positionView.selectPosition(language);

  // POSITION VIEW

  // ENGLISH VIEW

  public selectEnglishLevel = (
    language: languageTypes,
    temporaryUserId: number
  ): ITelegramTextFormatterResponse =>
    this.#englishLevelView.selectEnglishLevel(language, temporaryUserId);

  // ENGLISH VIEW

  // SKILLS VIEW

  public selectSkills = (
    language: languageTypes,
    temporaryUserId: number,
    existSkills: string[],
    categoryItem: INotPreparedTranslate
  ): ITelegramTextFormatterResponse =>
    this.#skillsView.selectSkills(
      language,
      temporaryUserId,
      existSkills,
      categoryItem
    );

  public showEnterSkills = (
    language: languageTypes,
    existSkills: string[]
  ): string => this.#skillsView.showEnterSkills(language, existSkills);

  // SKILLS VIEW

  // EMPLOYMENT VIEW

  public selectEmploymentOptions = (
    language: languageTypes,
    temporaryUserId: number,
    employmentOptions: INotPreparedTranslate[],
    existEmploymentOptions: INotPreparedTranslate[]
  ): ITelegramTextFormatterResponse =>
    this.#employmentOptionsView.selectEmploymentOptions(
      language,
      temporaryUserId,
      employmentOptions,
      existEmploymentOptions
    );

  // EMPLOYMENT VIEW

  // EXPERIENCE DETAILS VIEW

  public selectExperienceDetails = (
    language: languageTypes
  ): ITelegramTextFormatterResponse =>
    this.#experienceDetails.selectExperienceDetails(language);

  // EXPERIENCE DETAILS VIEW

  // COMPANY VIEW

  public selectCompany = (
    language: languageTypes
  ): ITelegramTextFormatterResponse =>
    this.#companyView.selectCompany(language);

  // COMPANY VIEW

  // PHONE VIEW

  public selectPhone = (
    language: languageTypes,
    isError: boolean,
    operationType?: ETelegramConfirmButtonType
  ): ITelegramTextFormatterResponse =>
    this.#phoneView.selectPhone(language, isError, operationType);

  // PHONE VIEW

  // USER ROLE VIEW

  public selectRole = (
    language: languageTypes
  ): ITelegramTextFormatterResponse => this.#userRoleView.selectRole(language);

  // USER ROLE VIEW

  // LANGUAGE VIEW

  public selectLanguage = (): ITelegramTextFormatterResponse =>
    this.#languageView.selectLanguage();

  // LANGUAGE VIEW

  // SUMMARY VIEW

  public selectWorkerSummary = (
    language: languageTypes,
    worker: IWorkerFinally,
    temporaryUserId: number,
    isEdit: boolean
  ): ITelegramTextFormatterResponse =>
    this.#summaryView.selectWorkerSummary(
      language,
      worker,
      temporaryUserId,
      isEdit
    );

  public selectEmployerSummary = (
    language: languageTypes,
    employer: IEmployerFinally,
    temporaryUserId: number,
    isEdit: boolean
  ): ITelegramTextFormatterResponse =>
    this.#summaryView.selectEmployerSummary(
      language,
      employer,
      temporaryUserId,
      isEdit
    );

  public saveSummary = (
    language: languageTypes,
    role: arrayValuesToType<typeof EUserRole.values>
  ): string => this.#summaryView.saveSummary(language, role);

  // SUMMARY VIEW

  // SUCCESS VIEW

  public selectSuccess = (
    language: languageTypes,
    item: string | INotPreparedTranslate[],
    operationType: ETelegramEditButtonType,
    typeMessage: 'item' | 'list',
    temporaryUserId?: number
  ): ITelegramTextFormatterResponse =>
    this.#successView.selectSuccess(
      language,
      item,
      operationType,
      typeMessage,
      temporaryUserId
    );

  // SUCCESS VIEW

  // TEMPORARY USER VIEW

  public selectTemporaryUserError = (language: languageTypes) =>
    this.#temporaryUserView.selectTemporaryUserError(language);

  // TEMPORARY USER VIEW

  // COMMON VIEW

  public clearMessage = (language: languageTypes): string =>
    this.clearMessage(language);

  // COMMON VIEW
}
