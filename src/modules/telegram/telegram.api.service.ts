import { AppConfigService } from '@config/config.service';
import { TelegramConfigType } from '@config/modules';
import { LoggerService } from '@logger/logger.service';
import EQueryCode from '@query/enum/query.enum';
import ETypeOperation from '@query/enum/type-operation.enum';
import {
  IQueryAttributes,
  IQueryParams
} from '@query/interface/query.inteface';
import QueryService from '@query/query.service';
import { Logger } from 'winston';
import {
  ITelegramQueryBody,
  ITelegramQueryHeaders,
  ITelegramResponse,
  ITelegramTextFormatterExtra,
  ITelegramUpdateQueryBody
} from '.';

export default class TelegramApiService {
  #config: TelegramConfigType;
  #baseHeaders: ITelegramQueryHeaders;
  #baseAttributes: IQueryAttributes<ITelegramQueryHeaders>;
  #queryService: QueryService;
  #logger: Logger;

  constructor() {
    this.#config = new AppConfigService().get('telegram');
    this.#baseHeaders = {
      'Content-Type': 'application/json'
    };
    this.#baseAttributes = {
      hostname: 'api.telegram.org',
      path: '',
      method: 'GET',
      port: 443,
      headers: {
        ...this.#baseHeaders
      }
    };
    this.#queryService = new QueryService();
    this.#logger = new LoggerService().getLogger();
  }

  public setWebhook = async (): Promise<void> => {
    const response = await this.#request<{}, boolean>(
      {
        ...this.#baseAttributes,
        path: `/bot${this.#config.token}/setWebhook`
      },
      {
        url: `${this.#config.webhookHost}/api/telegram/update`
      },
      ETypeOperation.DEFAULT,
      {},
      "Can't set webhook to telegram!"
    );

    if (response.ok === false) {
      throw new Error(
        `Can't set webhook to telegram! ${response?.description ?? ''}`
      );
    } else {
      this.#logger.info(response?.description);
    }
  };

  public sendMessage = async <ResultType>(
    chat_id: number | string,
    text: string,
    extra?: ITelegramTextFormatterExtra
  ): Promise<ITelegramResponse<ResultType>> => {
    return this.#request<ITelegramQueryBody, ResultType>(
      {
        ...this.#baseAttributes,
        method: 'POST',
        path: `/bot${this.#config.token}/sendMessage`
      },
      {},
      ETypeOperation.DEFAULT,
      {
        chat_id,
        text,
        parse_mode: 'HTML',
        ...extra
      },
      `Can't send message to telegram chat: [${chat_id}]!`
    );
  };

  public updateMessage = async <ResultType>(
    chat_id: number | string,
    message_id: number,
    text: string,
    extra?: ITelegramTextFormatterExtra
  ): Promise<ITelegramResponse<ResultType>> => {
    return this.#request<ITelegramUpdateQueryBody, ResultType>(
      {
        ...this.#baseAttributes,
        method: 'POST',
        path: `/bot${this.#config.token}/editMessageText`
      },
      {},
      ETypeOperation.DEFAULT,
      {
        chat_id,
        text,
        message_id,
        parse_mode: 'HTML',
        ...extra
      },
      `Can't send message to telegram chat: [${chat_id}]!`
    );
  };

  #request = async <BodyType, ResultType>(
    attributes: IQueryAttributes<ITelegramQueryHeaders>,
    params: IQueryParams,
    typeOperation: ETypeOperation,
    body?: BodyType,
    errorMessage?: string
  ): Promise<ITelegramResponse<ResultType>> => {
    const response = await this.#queryService.sendRequest<
      {},
      ITelegramResponse<ResultType>,
      BodyType
    >(attributes, params, typeOperation, body);

    if (
      response.code !== EQueryCode.OK ||
      (response.data !== undefined && response.data.ok === false)
    ) {
      this.#logger.warn(`${errorMessage} ${response.data?.description ?? ''}`);
    }

    return response.data;
  };
}
