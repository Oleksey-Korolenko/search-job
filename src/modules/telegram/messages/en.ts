const messagesInEnglish = {
  START: {
    DEFAULT: 'Please select a language for further work',
    BUTTON: {
      TYPE_LANGUAGE: 'English'
    }
  },
  SELECT_ROLE: {
    DEFAULT: 'Are you looking for a job or offering?',
    BUTTON: {
      WORKER: 'Looking for',
      EMPLOYER: 'Offering'
    }
  },
  CATEGORY: {
    DEFAULT: 'Please select one of the categories',
    ITEM: 'Please select one of the items for the <strong>{category}</strong> category'
  },
  EXPERIENSE: {
    DEFAULT: 'Please, choose what experience you have',
    BUTTON: {
      NOTHING: 'No experience',
      HALF_YEAR: 'Half a year of experience',
      ONE_YEAR: '1 years of experience',
      ONE_AND_HALF_YEAR: 'One and a half years of experience',
      TWO_YEARS: 'Two years of experience',
      TWO_AND_HALF_YEARS: 'Two and a half years of experience',
      THREE_YEARS: '3 years of experience',
      FOUR_YEARS: '4 years of experience',
      FIVE_YEARS: '5 years of experience',
      SIX_YEARS: '6 years of experience',
      SEVEN_YEARS: '7 years of experience',
      EIGHT_YEARS: '8 years of experience',
      NINE_YEARS: '9 years of experience',
      TEN_YEARS: '10 years of experience',
      MORE_THEN_TEN_YEARS: 'More then 10 years of experience'
    }
  },
  SALARY: {
    DEFAULT:
      'Please select what salary (final, with all taxes) you are claiming. Enter the number in dollars',
    ERROR:
      "Sorry, but we don't know that number. Do you want to try to enter a salary again?"
  },
  POSITION: {
    DEFAULT: 'Please select which position you are applying for'
  },
  ENGLISH_LEVEL: {
    DEFAULT: 'Please select what level of English you have',
    BUTTON: {
      NO_ENGLISH: 'No English',
      A1: 'Begginner/Elementary',
      A2: 'Pre-Intermediate',
      B1: 'Intermediate',
      B2: 'Upper-Intermediate',
      C1: 'Advanced/Fluent'
    }
  },
  CITIES: {
    DEFAULT: 'Please select a number of cities where you are looking for work',
    EXIST_CITIES: '\n\nA cities what have already been selected:\n\n'
  },
  SKILLS: {
    DEFAULT:
      'Please select a skills that you have in the profession of <strong>{category_item}</strong>',
    EXIST_SKILLS: '\n\nA skills what have already been selected:\n\n'
  },
  EMPLOYMENT_OPTIONS: {
    DEFAULT: 'Please select one or more employment options',
    EXIST_SKILLS:
      '\n\nA employment options what have already been selected:\n\n'
  },
  DESCRIPTION_TO_EXPERIENCE: {
    DEFAULT: 'Please describe your experience in more detail'
  },
  NAME: {
    DEFAULT: 'Please enter your full name'
  },
  COMPANY: {
    DEFAULT: 'Please enter your company'
  },
  PHONE: {
    DEFAULT:
      'Please enter your phone number (including country code, for example: 380)',
    ERROR:
      "Sorry, we can't save this phone number. Do you want to try to enter the phone number again?"
  },
  WORKER: {
    TITLE: '<strong>{name}</strong>\n\n',
    CATEGORY:
      'Specialty <strong>{category}</strong>. Applies for <strong>{position}</strong>.\n\n',
    EXPERIENCE: 'Experience: <strong>{experience}</strong>\n',
    SALARY: 'Salary wishes: <strong>{salary}</strong>\n',
    ENGLISH: 'English level: <strong>{english}</strong>\n\n',
    SKILLS: 'Main skills:\n\n',
    CITIES: '\nCities looking for work:\n\n',
    EMPLOYMENT_OPTIONS: '\nAvailable employment options:\n\n',
    EXPERIENCE_DETAILS: '\nDetails:\n\n'
  },
  DEFAULT_BUTTON: {
    EDIT: 'Edit ✏️',
    BACK: 'Back ⬅️',
    YES: 'Yes ✅',
    NO: 'No ❌',
    ADD: '{item} ➕',
    DELETE: '{item} 🗑',
    SAVE: 'Save ✅'
  },
  DEFAULT_MESSAGE: {
    INDENT: '\n',
    LIST_ITEM: '<strong>{item}</strong>\n',
    SUCCESS: 'The item <strong>{item}</strong> was selected',
    SUCCESS_LIST: 'A items what have already been selected:\n\n'
  }
};

export default messagesInEnglish;
