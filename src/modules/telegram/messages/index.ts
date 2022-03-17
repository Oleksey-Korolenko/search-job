import uaMessage from './ua';
import enMessage from './en';
import { arrayValuesToType } from '@custom-types/array-values.type';

const languagePack = {
  ua: uaMessage,
  en: enMessage
};

export const languageArray = Object.keys(languagePack) as Array<
  keyof typeof languagePack
>;

export type languageTypes = arrayValuesToType<typeof languageArray>;

export default languagePack;
