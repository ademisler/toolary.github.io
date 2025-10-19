export const TOOL_CATEGORIES = Object.freeze({
  inspect: Object.freeze({
    id: 'inspect',
    label: 'Inspect',
    description: 'Analyze on-page elements and styles.',
    order: 1
  }),
  capture: Object.freeze({
    id: 'capture',
    label: 'Capture',
    description: 'Collect and save page content.',
    order: 2
  }),
  enhance: Object.freeze({
    id: 'enhance',
    label: 'Enhance',
    description: 'Enhance the browsing experience.',
    order: 3
  }),
  utilities: Object.freeze({
    id: 'utilities',
    label: 'Utilities',
    description: 'General purpose site utilities.',
    order: 4
  })
});

export const DEFAULT_CATEGORY_ORDER = Object.freeze(
  Object.values(TOOL_CATEGORIES)
    .sort((a, b) => a.order - b.order)
    .map(category => category.id)
);

export const MESSAGE_TYPES = Object.freeze({
  ACTIVATE_TOOL: 'ACTIVATE_TOOL',
  ACTIVATE_TOOL_ON_PAGE: 'ACTIVATE_TOOL_ON_PAGE',
  CONTENT_SCRIPT_READY: 'CONTENT_SCRIPT_READY',
  CAPTURE_VISIBLE_TAB: 'CAPTURE_VISIBLE_TAB',
  DOWNLOAD_MEDIA: 'DOWNLOAD_MEDIA',
  GET_PAGE_DIMENSIONS: 'GET_PAGE_DIMENSIONS',
  SHOW_POPUP: 'SHOW_TOOLARY_POPUP',
  SHOW_FAVORITES: 'SHOW_FAVORITES',
  PDF_GENERATE: 'PDF_GENERATE',
  TRIGGER_PRINT: 'TRIGGER_PRINT',
  VIDEO_RECORDER_GET_CONTEXT: 'VIDEO_RECORDER_GET_CONTEXT'
});

export const TOOL_SHORTCUT_MAP = Object.freeze({
  'Alt+Shift+1': 'color-picker',
  'Alt+Shift+2': 'element-picker',
  'Alt+Shift+3': 'screenshot-picker'
});

export const TOOL_ICON_FALLBACK = 'tool';

export const AI_CONFIG = Object.freeze({
  STORAGE_KEYS: {
    API_KEYS: 'toolaryAIKeys',
    MODEL_PREFERENCE: 'toolaryAIModel',
    LANGUAGE_PREFERENCE: 'toolaryAILanguage'
  },
  MODELS: {
    SMART: 'gemini-2.5-flash',
    LITE: 'gemini-2.5-flash-lite'
  },
  MODEL_SELECTION: {
    AUTO: 'auto',
    SMART: 'smart',
    LITE: 'lite'
  },
  LANGUAGES: {
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
    ARABIC: 'ar'
  },
  API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta'
});
