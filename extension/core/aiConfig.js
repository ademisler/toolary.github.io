// AI Configuration module for Toolary
// Defines AI model constants and tool-to-model mapping

export const GEMINI_MODELS = Object.freeze({
  SMART: 'gemini-2.5-flash',
  LITE: 'gemini-2.5-flash-lite'
});

export const AI_MODEL_SELECTION = Object.freeze({
  AUTO: 'auto',
  SMART: 'smart',
  LITE: 'lite'
});

export const AI_LANGUAGES = Object.freeze({
  AUTO: 'auto',
  ENGLISH: 'en',
  TURKISH: 'tr',
  FRENCH: 'fr',
  SPANISH: 'es',
  GERMAN: 'de',
  ITALIAN: 'it',
  PORTUGUESE: 'pt',
  RUSSIAN: 'ru',
  CHINESE: 'zh',
  JAPANESE: 'ja',
  KOREAN: 'ko',
  ARABIC: 'ar',
  DUTCH: 'nl',
  SWEDISH: 'sv',
  NORWEGIAN: 'no',
  DANISH: 'da',
  FINNISH: 'fi',
  POLISH: 'pl',
  CZECH: 'cs',
  HUNGARIAN: 'hu',
  ROMANIAN: 'ro',
  BULGARIAN: 'bg',
  CROATIAN: 'hr',
  SERBIAN: 'sr',
  SLOVAK: 'sk',
  SLOVENIAN: 'sl',
  ESTONIAN: 'et',
  LATVIAN: 'lv',
  LITHUANIAN: 'lt',
  UKRAINIAN: 'uk',
  GREEK: 'el',
  HEBREW: 'he',
  HINDI: 'hi',
  THAI: 'th',
  VIETNAMESE: 'vi',
  INDONESIAN: 'id',
  MALAY: 'ms',
  FILIPINO: 'tl'
});

export const AI_LANGUAGE_NAMES = Object.freeze({
  auto: 'Auto (Browser Language)',
  en: 'English',
  tr: 'Türkçe',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  pl: 'Polski',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  bg: 'Български',
  hr: 'Hrvatski',
  sr: 'Српски',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  et: 'Eesti',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  uk: 'Українська',
  el: 'Ελληνικά',
  he: 'עברית',
  hi: 'हिन्दी',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  tl: 'Filipino'
});

// Tool-to-model mapping configuration
// Defines which model each tool should use by default
export const TOOL_MODEL_MAPPING = Object.freeze({
  'ai-text-summarizer': 'lite',
  'ai-code-explainer': 'smart'
});

// Model selection logic
export function getModelForTool(toolId, userPreference = 'auto') {
  // If user has set a specific preference, use it
  if (userPreference !== 'auto') {
    return userPreference === 'smart' ? GEMINI_MODELS.SMART : GEMINI_MODELS.LITE;
  }
  
  // Otherwise, use tool-specific mapping
  const toolModel = TOOL_MODEL_MAPPING[toolId];
  if (toolModel) {
    return toolModel === 'smart' ? GEMINI_MODELS.SMART : GEMINI_MODELS.LITE;
  }
  
  // Default to smart model if no mapping found
  return GEMINI_MODELS.SMART;
}

// API configuration
export const AI_API_CONFIG = Object.freeze({
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    COOLDOWN_PERIOD: 60000 // 1 minute
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BACKOFF_DELAY: 1000 // 1 second base delay
  }
});
