import ukMessage from './uk';
import enMessage from './en';

const languagePack = {
  uk: ukMessage,
  en: enMessage,
};

export type languagePackType = typeof languagePack;

export default languagePack;
