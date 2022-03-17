import ukMessage from './uk';
import enMessage from './en';
import { arrayValuesToType } from '@custom-types/array-values.type';

const languagePack = {
  uk: ukMessage,
  en: enMessage
};

export const languageArray: Array<keyof typeof languagePack> = Object.keys(
  languagePack
).map(key => languagePack[key]);

export type languageTypes = arrayValuesToType<typeof languageArray>;

export default languagePack;
