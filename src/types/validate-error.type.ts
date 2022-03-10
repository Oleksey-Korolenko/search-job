export default class ValidateError extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, ValidateError.prototype);
  }
}
