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
    EMPLOYER: 'Please select what position you hold in the company',
    WORKER: 'Please select which position you are applying for'
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
  SKILLS: {
    DEFAULT:
      'Please enter a skills/technologies that you have in the specialty <strong>{category_item}</strong>',
    INSTRUCTION:
      '\n\nYou can enter skills one by one (for example: Git), or separate them with a comma (for example: Git, Visual Studio Code, HTML)',
    EXIST_ITEMS: '\n\nAlready preserved a skills:\n\n',
    SAVE: '\n\nIf all skills are already presented correctly, and you have finished entering new ones, click "<strong>{btn}</strong>"'
  },
  EMPLOYMENT_OPTIONS: {
    DEFAULT: 'Please select one or more employment options',
    EXIST_ITEMS: '\n\nA employment options what have already been selected:\n\n'
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
    EXPERIENCE_DETAILS: '\nDetails:\n\n',
    SAVE: 'Your worker account has been successfully saved',
    BUTTON: {
      NAME: 'Full name',
      CATEGORY: 'Category',
      POSITION: 'Position',
      EXPERIENCE: 'Experience',
      SALARY: 'Salary',
      ENGLISH: 'English level',
      SKILLS: 'Skills',
      EMPLOYMENT_OPTIONS: 'Employment options',
      EXPERIENCE_DETAILS: 'Experience details'
    }
  },
  EMPLOYER: {
    TITLE: '<strong>{name}</strong>\n\n',
    COMPANY:
      'Company <strong>{company}</strong>. Position <strong>{position}</strong>.\n\n',
    PHONE: 'Phone number: <strong>{phone}</strong>\n',
    SAVE: 'Your employer account has been successfully saved',
    BUTTON: {
      NAME: 'Full name',
      COMPANY: 'Company',
      POSITION: 'Position',
      PHONE: 'Phone'
    }
  },
  TEMPORARY_USER: {
    ERROR:
      'Sorry, we could not find any intermediate data for your profile. Do you want to start entering your profile data again?',
    EXIST_ACC: 'Account is already registered.'
  },
  DEFAULT_BUTTON: {
    EDIT: 'Edit ??????',
    BACK: 'Back ??????',
    YES: 'Yes ???',
    NO: 'No ???',
    ADD: '{item} ???',
    DELETE: '{item} ????',
    SAVE: 'Save ???'
  },
  DEFAULT_MESSAGE: {
    INDENT: '\n',
    LIST_ITEM: '<strong>{item}</strong>\n',
    SUCCESS: 'The item <strong>{item}</strong> was selected',
    SUCCESS_LIST: 'A items what have already been selected:\n\n',
    CLEAR: 'Well, you can choose other actions'
  }
};

export default messagesInEnglish;
