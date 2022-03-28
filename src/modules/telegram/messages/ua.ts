const messagesInuarainian = {
  START: {
    BUTTON: {
      TYPE_LANGUAGE: 'Українською'
    }
  },
  SELECT_ROLE: {
    DEFAULT: 'Ви шукаєте роботу чи пропонуєте?',
    BUTTON: {
      WORKER: 'Шукаю',
      EMPLOYER: 'Пропоную'
    }
  },
  CATEGORY: {
    DEFAULT: 'Будь ласка, оберіть одну з категорій',
    ITEM: 'Будь ласка, оберіть один з пунктів для категорії <strong>{category}</strong>'
  },
  EXPERIENSE: {
    DEFAULT: 'Будь ласка, оберіть якій у вас досвід',
    BUTTON: {
      NOTHING: 'Немає досвіду',
      HALF_YEAR: 'Півроку',
      ONE_YEAR: '1 рік',
      ONE_AND_HALF_YEAR: 'Півтора роки',
      TWO_YEARS: '2 роки',
      TWO_AND_HALF_YEARS: 'Два з половиною роки',
      THREE_YEARS: '3 роки',
      FOUR_YEARS: '4 роки',
      FIVE_YEARS: '5 роки',
      SIX_YEARS: '6 роки',
      SEVEN_YEARS: '7 роки',
      EIGHT_YEARS: '8 роки',
      NINE_YEARS: '9 роки',
      TEN_YEARS: '10 роки',
      MORE_THEN_TEN_YEARS: 'Більше 10 років'
    }
  },
  SALARY: {
    DEFAULT:
      'Будь ласка, вкажіть на яку зарплату (фінальну, з усіма податками) ви претендуєте. Вкажіть цифру у доларах',
    ERROR:
      'Нам жаль, але ми не знаємо такого числа. Ви бажаєте спробувати вказати зарплату знову?'
  },
  POSITION: {
    DEFAULT: 'Будь ласка, вкажіть на яку позицію ви претендуєте'
  },
  ENGLISH_LEVEL: {
    DEFAULT: 'Будь ласка, оберіть який рівень англійської мови ви маєте',
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
      'Будь ласка, введіть ряд навичок/технологій, якими ви обладаєте у спеціальності <strong>{category_item}</strong>',
    INSTRUCTION:
      '\n\nНавички ви можете вводити по одній (наприклад: Git), чи розділяючи їх комою (наприклад: Git, Visual Studio Code, HTML)',
    EXIST_ITEMS: '\n\nВже збережені ряд навичок:\n\n',
    SAVE: '\n\nЯкщо всі навички вище представленні правильно, та ви закінчили вводити нові, натисніть кнопку "<strong>{btn}</strong>"'
  },
  EMPLOYMENT_OPTIONS: {
    DEFAULT: 'Будь ласка, виберіть один чи декілька варіантів зайнятості',
    EXIST_ITEMS: '\n\nВже обран ряд варіантів:\n\n'
  },
  DESCRIPTION_TO_EXPERIENCE: {
    DEFAULT: 'Будь ласка, опишіть ваш досвід більш розгорнуто'
  },
  NAME: {
    DEFAULT: 'Будь ласка, вкажіть ваше ПІБ'
  },
  COMPANY: {
    DEFAULT: 'Будь ласка, вкажіть вашу компанию'
  },
  PHONE: {
    DEFAULT:
      'Будь ласка, вкажіть ваш номер телефону (разом з кодом країни, наприклад: 380)',
    ERROR:
      'Нам жаль, але ми не можемо зберегти цей номер телефону. Ви бажаєте спробувати вказати номер телефону знову?'
  },
  WORKER: {
    TITLE: '<strong>{name}</strong>\n\n',
    CATEGORY:
      'По спеціальності <strong>{category}</strong>. Претендує на посаду <strong>{position}</strong>.\n\n',
    EXPERIENCE: 'Досвідом: <strong>{experience}</strong>\n',
    SALARY: 'Зарплатні побажання: <strong>{salary}</strong>\n',
    ENGLISH: 'Рівень англійскої мови: <strong>{english}</strong>\n\n',
    SKILLS: 'Головні навички:\n\n',
    CITIES: '\nМіста у яких шукається робота:\n\n',
    EMPLOYMENT_OPTIONS: '\nДоступні варіанти зайнятості:\n\n',
    EXPERIENCE_DETAILS: '\nДетальна інформація:\n\n'
  },
  EMPLOYER: {
    TITLE: '<strong>{name}</strong>\n\n',
    COMPANY:
      'Компанія <strong>{company}</strong>. Посада <strong>{position}</strong>.\n\n',
    PHONE: 'Номер телефону: <strong>{phone}</strong>\n'
  },
  DEFAULT_BUTTON: {
    EDIT: 'Редагувати ✏️',
    BACK: 'Назад ⬅️',
    YES: 'Так ✅',
    NO: 'Ні ❌',
    ADD: '{item} ➕',
    DELETE: '{item} 🗑',
    SAVE: 'Зберегти ✅'
  },
  DEFAULT_MESSAGE: {
    INDENT: '\n',
    LIST_ITEM: '<strong>{item}</strong>\n',
    SUCCESS: 'Був обран пункт <strong>{item}</strong>',
    SUCCESS_LIST: 'Були обрани пункти:\n\n'
  }
};

export default messagesInuarainian;
