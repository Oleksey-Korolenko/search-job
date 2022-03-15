import _, { isArray, isInteger, isObject } from 'lodash';
import { ILimitRegBody, IRegBodyWithId } from '.';
import ValidateError from './validate-error.type';

export class ValidationDefault {
  protected limitFields: Array<keyof ILimitRegBody>;
  protected idFields: Array<keyof IRegBodyWithId>;

  constructor() {
    this.limitFields = ['limit', 'offset'];
    this.idFields = ['id'];
  }

  protected limit = (limit: number) => {
    if (limit === undefined) {
      throw new ValidateError(`Payload atribute: [limit] doesn't exist!`);
    }

    if (!_.isInteger(+limit)) {
      throw new ValidateError(
        `Payload atribute: [limit] type isn't equal to number!`
      );
    }
  };

  protected offset = (offset: number) => {
    if (offset === undefined) {
      throw new ValidateError(`Payload atribute: [offset] doesn't exist!`);
    }

    if (!_.isInteger(+offset)) {
      throw new ValidateError(
        `Payload atribute: [offset] type isn't equal to number!`
      );
    }
  };

  protected id = (id: number) => {
    if (id === undefined) {
      throw new ValidateError(`Payload atribute: [id] doesn't exist!`);
    }

    if (!_.isInteger(+id)) {
      throw new ValidateError(
        `Payload atribute: [id] type isn't equal to number!`
      );
    }
  };

  protected pick = <T>(obj: T, fields: Array<keyof T>): T => {
    const trimObj = this.#trimAll<T>(obj);
    return _.pick(trimObj, fields) as T;
  };

  #trimAll = <T>(obj: T): T => {
    const trimObj = obj;

    for (const key in obj) {
      if (typeof obj[key] === 'string' && _.isInteger(+obj[key])) {
        trimObj[key] = +obj[key] as unknown as T[Extract<keyof T, string>];
        continue;
      }

      if (typeof obj[key] === 'string') {
        trimObj[key] = `${obj[key]}`.trim() as unknown as T[Extract<
          keyof T,
          string
        >];
        continue;
      }

      trimObj[key] = this.#trimArray<T[Extract<keyof T, string>]>(obj[key]);

      if (isObject(obj[key])) {
        trimObj[key] = this.#trimAll(obj[key]);
      }
    }

    return trimObj;
  };

  #trimArray = <T>(array: T): T => {
    if (!isArray(array)) {
      return array;
    }

    const trimArray = [];

    for (const item of array) {
      if (typeof item === 'string') {
        trimArray.push(item.trim());
      } else if (isArray(item)) {
        trimArray.push(this.#trimArray(item));
      } else if (isObject(item)) {
        trimArray.push(this.#trimAll(item));
      } else {
        trimArray.push(item);
      }
    }

    return trimArray as unknown as T;
  };
}
