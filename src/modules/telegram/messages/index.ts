import ukMessage from './uk';
import enMessage from './en';

const languagePack = {
  uk: ukMessage,
  en: enMessage
};

export const languageArray: Array<keyof typeof languagePack> = Object.keys(
  languagePack
).map(key => languagePack[key]);

export type languageTypes = typeof languageArray extends ReadonlyArray<
  infer languageTypes
>
  ? languageTypes
  : never;

export default languagePack;
