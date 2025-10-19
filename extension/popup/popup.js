const SUPPORTED_LANGUAGES = ['en', 'tr', 'fr'];
const HIDDEN_STORAGE_KEY = 'toolaryHiddenTools';
const USAGE_STORAGE_KEY = 'toolaryToolUsage';
const LEGACY_HIDDEN_KEYS = ['pickachuHiddenTools', 'hiddenTools'];

const themeMediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const coreModulesPromise = Promise.all([
  import(chrome.runtime.getURL('core/toolRegistry.js')),
  import(chrome.runtime.getURL('core/messageRouter.js'))
]).then(([toolRegistry, messageRouter]) => ({
  toolRegistry,
  messageRouter
})).catch((error) => {
  console.error('Toolary popup: failed to load core modules', error);
  throw error;
});

const uiComponentsPromise = import(chrome.runtime.getURL('shared/ui-components.js')).catch((error) => {
  console.error('Toolary popup: failed to load UI components', error);
  throw error;
});

const iconsPromise = import(chrome.runtime.getURL('shared/icons.js')).catch((error) => {
  console.error('Toolary popup: failed to load icons module', error);
  throw error;
});

// Category labels will be localized dynamically
const CATEGORY_KEYS = Object.freeze({
  inspect: 'inspect',
  capture: 'capture', 
  enhance: 'enhance',
  utilities: 'utilities'
});

const VALID_CATEGORIES = new Set(['all', ...Object.keys(CATEGORY_KEYS)]);

const state = {
  isInitialized: false,
  toolMetadata: [],
  filteredTools: [],
  toolMap: new Map(),
  hiddenTools: new Set(),
  toolUsage: new Map(),
  searchTerm: '',
  rawSearchInput: '',
  searchTokens: [],
  activeCategory: 'all',
  langMap: {},
  loading: true,
  currentPage: 1,
  toolsPerPage: 6
};

const elements = {};
const modules = {};
const ui = {};
const icons = {};

let shortcutsOverlay = null;
let currentThemeSetting = 'system';
let keyboardShortcuts = {};
let pendingHidden = new Set();

function dedupeStringList(list = []) {
  return Array.from(
    new Set(
      (Array.isArray(list) ? list : [])
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter(Boolean)
    )
  );
}

function resolveStoredList(data, primaryKey, legacyKeys = []) {
  const current = dedupeStringList(data?.[primaryKey]);
  if (current.length > 0) {
    return { list: current, migratedFrom: null };
  }

  for (const legacyKey of legacyKeys) {
    const legacyList = dedupeStringList(data?.[legacyKey]);
    if (legacyList.length > 0) {
      return { list: legacyList, migratedFrom: legacyKey };
    }
  }

  return { list: [], migratedFrom: null };
}

// Reserved for future use
// eslint-disable-next-line no-unused-vars
function formatCategoryLabel(category) {
  if (!category) return '';
  return `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
}

// Reserved for future use
// eslint-disable-next-line no-unused-vars
function parseSearchQuery(raw = '') {
  if (typeof raw !== 'string') {
    return { text: '', tokens: [] };
  }

  const tokens = [];
  const textParts = [];
  const segments = raw.trim().split(/\s+/).filter(Boolean);

  segments.forEach((segment) => {
    const [prefix, ...rest] = segment.split(':');
    if (!rest.length) {
      textParts.push(segment);
      return;
    }

    const value = rest.join(':').trim();
    if (!value) {
      textParts.push(segment);
      return;
    }

    const key = prefix.trim().toLowerCase();
    const normalizedValue = value.toLowerCase();

    switch (key) {
      case 'category':
      case 'cat':
        tokens.push({ type: 'category', value: normalizedValue });
        break;
      case 'tag':
      case 'tags':
        tokens.push({ type: 'tag', value: normalizedValue });
        break;
      case 'id':
        tokens.push({ type: 'id', value: normalizedValue });
        break;
      default:
        textParts.push(segment);
        break;
    }
  });

  return {
    text: textParts.join(' '),
    tokens
  };
}

// Reserved for future use
// eslint-disable-next-line no-unused-vars
function buildSearchInputValue(text = '', tokens = []) {
  const tokenStrings = tokens.map((token) => `${token.type}:${token.value}`);
  return [text.trim(), ...tokenStrings].filter(Boolean).join(' ').trim();
}

// Reserved for future use
// eslint-disable-next-line no-unused-vars
function resolveActiveCategory() {
  const categoryToken = (state.searchTokens || []).find((token) => token.type === 'category' && VALID_CATEGORIES.has(token.value));
  if (categoryToken) {
    return categoryToken.value;
  }
  return VALID_CATEGORIES.has(state.activeCategory) ? state.activeCategory : 'all';
}

// Reserved for future use
// eslint-disable-next-line no-unused-vars
function matchesTokenFilters(tool, tokens = []) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return true;
  }

  return tokens.every((token) => {
    if (!token?.type) return true;
    switch (token.type) {
      case 'category':
        // handled separately by resolveActiveCategory
        return true;
      case 'tag':
      case 'tags': {
        const tags = Array.isArray(tool.tags) ? tool.tags : [];
        return tags.some((tag) => tag.toLowerCase().includes(token.value));
      }
      case 'id':
        return typeof tool.id === 'string' && tool.id.toLowerCase().includes(token.value);
      default:
        return true;
    }
  });
}

function resolveLanguage(code = 'en') {
  const normalized = String(code || 'en').trim().toLowerCase();
  if (!normalized) return 'en';
  
  // Direct match
  if (SUPPORTED_LANGUAGES.includes(normalized)) return normalized;
  
  // Extract base language (e.g., 'tr-TR' -> 'tr')
  const base = normalized.split('-')[0];
  if (SUPPORTED_LANGUAGES.includes(base)) return base;
  
  // Country-specific mappings
  const countryMappings = {
    'tr': 'tr',      // Turkey
    'fr': 'fr',      // France
    'fr-ca': 'fr',   // Canada (French)
    'fr-be': 'fr',   // Belgium (French)
    'fr-ch': 'fr',   // Switzerland (French)
    'fr-lu': 'fr',   // Luxembourg (French)
    'fr-mc': 'fr',   // Monaco (French)
    'fr-sn': 'fr',   // Senegal (French)
    'fr-ci': 'fr',   // Ivory Coast (French)
    'fr-ml': 'fr',   // Mali (French)
    'fr-bf': 'fr',   // Burkina Faso (French)
    'fr-ne': 'fr',   // Niger (French)
    'fr-td': 'fr',   // Chad (French)
    'fr-mg': 'fr',   // Madagascar (French)
    'fr-cm': 'fr',   // Cameroon (French)
    'fr-cd': 'fr',   // Democratic Republic of Congo (French)
    'fr-cg': 'fr',   // Republic of Congo (French)
    'fr-gq': 'fr',   // Equatorial Guinea (French)
    'fr-dj': 'fr',   // Djibouti (French)
    'fr-km': 'fr',   // Comoros (French)
    'fr-sc': 'fr',   // Seychelles (French)
    'fr-va': 'fr',   // Vatican (French)
    'fr-re': 'fr',   // Réunion (French)
    'fr-gf': 'fr',   // French Guiana (French)
    'fr-mq': 'fr',   // Martinique (French)
    'fr-gp': 'fr',   // Guadeloupe (French)
    'fr-yt': 'fr',   // Mayotte (French)
    'fr-pf': 'fr',   // French Polynesia (French)
    'fr-nc': 'fr',   // New Caledonia (French)
    'fr-wf': 'fr',   // Wallis and Futuna (French)
    'fr-tf': 'fr',   // French Southern Territories (French)
    'fr-pm': 'fr',   // Saint Pierre and Miquelon (French)
    'fr-bl': 'fr',   // Saint Barthélemy (French)
    'fr-mf': 'fr',   // Saint Martin (French)
  };
  
  // Check country mappings
  if (countryMappings[normalized]) return countryMappings[normalized];
  if (countryMappings[base]) return countryMappings[base];
  
  // Default to English for all other languages
  return 'en';
}

async function loadLang(lang) {
  const resolved = resolveLanguage(lang);
  const candidates = [...new Set([resolved, resolveLanguage(resolved), 'en'])];

  for (const candidate of candidates) {
    try {
      const res = await fetch(chrome.runtime.getURL(`_locales/${candidate}/messages.json`));
      if (res.ok) {
        return res.json();
      }
    } catch (error) {
      console.error(`Error loading language ${candidate}:`, error);
    }
  }

  return {};
}

function applyLang(map) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = map[el.dataset.i18n]?.message || el.textContent;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = map[el.dataset.i18nTitle]?.message || el.title;
  });
  
  // Update category labels in menu
  document.querySelectorAll('.category-menu-item span').forEach(el => {
    const category = el.parentElement.dataset.category;
    if (category && category !== 'all') {
      const categoryKey = CATEGORY_KEYS[category];
      if (categoryKey) {
        el.textContent = map[categoryKey]?.message || el.textContent;
      }
    }
  });
  
  // Update tool names and descriptions in cards
  document.querySelectorAll('.tool-card__title').forEach(el => {
    const toolCard = el.closest('.tool-card');
    if (toolCard) {
      const toolId = toolCard.dataset.toolId;
      const tool = state.toolMap.get(toolId);
      if (tool) {
        const nameKey = tool.i18n?.label || tool.i18n?.title || tool.id;
        const localizedName = map[nameKey]?.message || tool.name;
        el.textContent = localizedName;
        
        // Update description too
        const descriptionEl = toolCard.querySelector('.tool-card__description');
        if (descriptionEl) {
          const descriptionKey = tool.i18n?.description || `${tool.id.replace(/-/g, '')}Description`;
          const localizedDescription = map[descriptionKey]?.message || tool.description || '';
          descriptionEl.textContent = localizedDescription;
        }
      }
    }
  });
  
  // Update tool names in settings
  document.querySelectorAll('.settings-tool-item__name').forEach(el => {
    const toolItem = el.closest('.settings-tool-item');
    if (toolItem) {
      const toolId = toolItem.dataset.toolId;
      const tool = state.toolMap.get(toolId);
      if (tool) {
        const nameKey = tool.i18n?.label || tool.i18n?.title || tool.id;
        const localizedName = map[nameKey]?.message || tool.name;
        el.textContent = localizedName;
      }
    }
  });
  
  // Update category labels in settings
  document.querySelectorAll('.settings-tool-item__category').forEach(el => {
    const toolItem = el.closest('.settings-tool-item');
    if (toolItem) {
      const toolId = toolItem.dataset.toolId;
      const tool = state.toolMap.get(toolId);
      if (tool) {
        const categoryKey = CATEGORY_KEYS[tool.category];
        if (categoryKey) {
          el.textContent = map[categoryKey]?.message || el.textContent;
        }
      }
    }
  });
}

function getEffectiveTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  
  // Auto theme detection
  if (theme === 'system' || !theme) {
    // Check system preference
    if (themeMediaQuery && themeMediaQuery.matches) return 'dark';
    
    // Check browser's color scheme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Check time-based detection (optional)
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) return 'dark';
    
    return 'light';
  }
  
  return 'light';
}

function applyTheme(theme) {
  currentThemeSetting = theme;
  const effective = getEffectiveTheme(theme);
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(effective === 'dark' ? 'dark' : 'light');
}

function updateVersionBadge() {
  try {
    const badge = document.getElementById('version-badge');
    if (!badge || !chrome?.runtime?.getManifest) return;
    const manifest = chrome.runtime.getManifest();
    if (manifest?.version) {
      badge.textContent = `v${manifest.version}`;
    }
  } catch (error) {
    console.debug('Toolary popup: unable to update version badge', error);
  }
}

if (themeMediaQuery) {
  const handleThemeChange = () => {
    if (currentThemeSetting === 'system') {
      applyTheme('system');
    }
  };

  if (typeof themeMediaQuery.addEventListener === 'function') {
    themeMediaQuery.addEventListener('change', handleThemeChange);
  } else if (typeof themeMediaQuery.addListener === 'function') {
    themeMediaQuery.addListener(handleThemeChange);
  }
}

function cacheElements() {
  Object.assign(elements, {
    searchInput: document.getElementById('tool-search'),
    categoryMenuBtn: document.getElementById('category-menu-btn'),
    categoryMenu: document.getElementById('category-menu'),
    categoryIcon: document.getElementById('category-icon'),
    toolsSection: document.getElementById('tools-section'),
    toolsGrid: document.querySelector('#tools-section .tools-grid'),
    settingsShortcutsBtn: document.getElementById('settings-shortcuts-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsPanel: document.getElementById('settings-panel'),
    settingsToolList: document.getElementById('settings-tool-list'),
    settingsClose: document.getElementById('close-settings'),
    settingsReset: document.getElementById('settings-reset'),
    settingsSave: document.getElementById('settings-save'),
    // Settings tabs
    settingsTabPreferences: document.getElementById('settings-tab-preferences'),
    settingsTabTools: document.getElementById('settings-tab-tools'),
    settingsTabAbout: document.getElementById('settings-tab-about'),
    settingsContentPreferences: document.getElementById('settings-content-preferences'),
    settingsContentTools: document.getElementById('settings-content-tools'),
    settingsContentAbout: document.getElementById('settings-content-about'),
    settingsLangSelect: document.getElementById('settings-lang-select'),
    settingsThemeSelect: document.getElementById('settings-theme-select'),
    pagination: document.getElementById('pagination'),
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page')
  });

  elements.paginationDots = document.querySelector('.pagination-dots');
  elements.paginationInfo = document.querySelector('.pagination-info');
}

function createToolCardElement(tool) {
  const card = document.createElement('div');
  card.className = 'tool-card';
  card.setAttribute('data-tool-id', tool.id);
  
  const icon = document.createElement('div');
  icon.className = 'tool-card__icon';
  
  // Try to use icon definitions directly first, then fallback to SVG files
  if (icons.createIconElement) {
    try {
       const iconSvg = icons.createIconElement(tool.icon, { size: 32, decorative: true });
      if (iconSvg) {
        console.log(`Using icon definition for ${tool.name}`);
        icon.appendChild(iconSvg);
      } else {
        throw new Error('Icon definition not found');
      }
    } catch (error) {
      console.log(`Icon definition failed for ${tool.name}, trying SVG file:`, error);
       // Fallback to SVG file
       const iconImg = document.createElement('img');
       const iconUrl = chrome.runtime.getURL(`icons/tools/${tool.icon}.svg`);
       iconImg.src = iconUrl;
       iconImg.alt = tool.name;
       iconImg.width = 32;
       iconImg.height = 32;
      iconImg.style.display = 'block';
      
      console.log(`Loading icon for ${tool.name}: ${iconUrl}`);
      
      iconImg.onload = () => {
        console.log(`Icon loaded successfully: ${tool.name}`);
      };
      
      iconImg.onerror = (error) => {
        console.error(`Failed to load icon for ${tool.name}:`, error);
      };
      
      icon.appendChild(iconImg);
    }
  } else {
     // Fallback to SVG file if icons module not available
     const iconImg = document.createElement('img');
     const iconUrl = chrome.runtime.getURL(`icons/tools/${tool.icon}.svg`);
     iconImg.src = iconUrl;
     iconImg.alt = tool.name;
     iconImg.width = 32;
     iconImg.height = 32;
    iconImg.style.display = 'block';
    
    console.log(`Loading icon for ${tool.name}: ${iconUrl}`);
    
    iconImg.onload = () => {
      console.log(`Icon loaded successfully: ${tool.name}`);
    };
    
    iconImg.onerror = (error) => {
      console.error(`Failed to load icon for ${tool.name}:`, error);
    };
    
    icon.appendChild(iconImg);
  }
  
  const content = document.createElement('div');
  content.className = 'tool-card__content';
  
  const title = document.createElement('div');
  title.className = 'tool-card__title';
  
  // Get localized name from i18n
  const nameKey = tool.i18n?.label || tool.i18n?.title || tool.id;
  const localizedName = state.langMap[nameKey]?.message || tool.name;
  title.textContent = localizedName;
  
  const description = document.createElement('div');
  description.className = 'tool-card__description';
  
  // Get description from localization
  const descriptionKey = tool.i18n?.description || `${tool.id.replace(/-/g, '')}Description`;
  const localizedDescription = state.langMap[descriptionKey]?.message || tool.description || '';
  description.textContent = localizedDescription;
  
  // Always show description element, let CSS handle visibility
  description.style.display = '';
  
  content.appendChild(title);
  content.appendChild(description);
  
  card.appendChild(icon);
  card.appendChild(content);
  
  // Add click handler
  card.addEventListener('click', () => {
    if (card.classList.contains('tool-card--disabled')) return;
    activateTool(tool.id);
  });

  return card;
}

async function loadPreferences() {
  const syncKeys = [
    HIDDEN_STORAGE_KEY,
    ...LEGACY_HIDDEN_KEYS
  ];

  const syncData = await chrome.storage.sync.get(syncKeys);
  const hidden = resolveStoredList(syncData, HIDDEN_STORAGE_KEY, LEGACY_HIDDEN_KEYS);

  state.hiddenTools = new Set(hidden.list);

  const migrationTasks = [];
  if (hidden.migratedFrom) {
    migrationTasks.push(chrome.storage.sync.set({ [HIDDEN_STORAGE_KEY]: hidden.list }));
    migrationTasks.push(chrome.storage.sync.remove(hidden.migratedFrom));
  }

  // Load tool usage data
  const localData = await chrome.storage.local.get([USAGE_STORAGE_KEY]);
  const usageData = localData[USAGE_STORAGE_KEY] || {};
  state.toolUsage = new Map(Object.entries(usageData));

  if (migrationTasks.length > 0) {
    Promise.allSettled(migrationTasks).catch((error) => {
      console.warn('Toolary popup: storage migration warnings', error);
    });
  }
}

async function saveHiddenTools() {
  await chrome.storage.sync.set({ [HIDDEN_STORAGE_KEY]: Array.from(state.hiddenTools) });
}

async function saveToolUsage() {
  const usageData = Object.fromEntries(state.toolUsage);
  await chrome.storage.local.set({ [USAGE_STORAGE_KEY]: usageData });
}

function matchesSearch(tool, term) {
  if (!term) return true;
  const haystack = [
    tool.name,
    tool.description,
    tool.category,
    ...(tool.tags || []),
    ...(tool.keywords || [])
  ].join(' ').toLowerCase();
  return haystack.includes(term);
}

function rebuildShortcutMap(tools = []) {
  keyboardShortcuts = {};
  tools.forEach((tool) => {
    const shortcut = typeof tool.shortcut === 'object' && tool.shortcut
      ? tool.shortcut.default || tool.shortcut.mac || ''
      : tool.shortcut || '';
    if (typeof shortcut === 'string') {
      const match = shortcut.match(/([A-Za-z0-9])$/);
      if (match) {
        keyboardShortcuts[match[1]] = tool.id;
      }
    }
  });
}

function applyFilters() {
  const term = state.searchTerm.trim().toLowerCase();
  const category = state.activeCategory;

  const filtered = state.toolMetadata.filter((tool) => {
    if (category !== 'all' && tool.category !== category) {
      return false;
    }

    const hidden = state.hiddenTools.has(tool.id);
    if (!term && hidden) {
      return false;
    }

    return matchesSearch(tool, term);
  });

  // Sort by usage count (most used first)
  filtered.sort((a, b) => {
    const usageA = state.toolUsage.get(a.id) || 0;
    const usageB = state.toolUsage.get(b.id) || 0;
    return usageB - usageA;
  });

  state.filteredTools = filtered;
  state.currentPage = 1; // Reset to first page when filters change
  rebuildShortcutMap(filtered);
  renderMainToolsGrid();
  updatePagination();
}

function renderToolLists() {
  // Render main tools grid with pagination
  renderMainToolsGrid();
}

function renderMainToolsGrid() {
  if (!elements.toolsGrid || !state.filteredTools) return;
  
  const startIndex = (state.currentPage - 1) * state.toolsPerPage;
  const endIndex = startIndex + state.toolsPerPage;
  const pageTools = state.filteredTools.slice(startIndex, endIndex);
  
  elements.toolsGrid.innerHTML = '';
  
  // Fill grid with tools (up to 6)
  for (let i = 0; i < state.toolsPerPage; i++) {
    if (i < pageTools.length) {
      const tool = pageTools[i];
      const card = createToolCardElement(tool);
      elements.toolsGrid.appendChild(card);
    } else {
      // Add empty placeholder for consistent grid layout
      const placeholder = document.createElement('div');
      placeholder.className = 'tool-card-placeholder';
      elements.toolsGrid.appendChild(placeholder);
    }
  }
}


function updatePagination() {
  if (!elements.pagination) return;
  
  const totalPages = Math.ceil(state.filteredTools.length / state.toolsPerPage);
  const showPagination = totalPages > 1;
  
  elements.pagination.hidden = !showPagination;
  
  if (!showPagination) return;
  
  // Update pagination buttons
  if (elements.prevPage) {
    elements.prevPage.disabled = state.currentPage <= 1;
  }
  if (elements.nextPage) {
    elements.nextPage.disabled = state.currentPage >= totalPages;
  }
  
  // Update pagination dots (if they exist)
  if (elements.paginationDots) {
    elements.paginationDots.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `pagination-dot ${i === state.currentPage ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to page ${i}`);
      dot.addEventListener('click', () => goToPage(i));
      elements.paginationDots.appendChild(dot);
    }
  }
  
  // Update pagination info (if it exists)
  if (elements.paginationInfo) {
    const startItem = (state.currentPage - 1) * state.toolsPerPage + 1;
    const endItem = Math.min(state.currentPage * state.toolsPerPage, state.filteredTools.length);
    elements.paginationInfo.textContent = `${startItem}-${endItem} of ${state.filteredTools.length}`;
  }
}

function goToPage(page) {
  const totalPages = Math.ceil(state.filteredTools.length / state.toolsPerPage);
  if (page < 1 || page > totalPages) return;
  
  state.currentPage = page;
  renderMainToolsGrid();
  updatePagination();
}

function nextPage() {
  const totalPages = Math.ceil(state.filteredTools.length / state.toolsPerPage);
  if (state.currentPage < totalPages) {
    goToPage(state.currentPage + 1);
  }
}

function prevPage() {
  if (state.currentPage > 1) {
    goToPage(state.currentPage - 1);
  }
}

function setLoadingState(isLoading) {
  state.loading = isLoading;
  // Loading state UI removed for compact design
}

function updateSearchHint() {
  // Search hint UI removed for compact design
}

function updateFooterButtons(map) {
  const shortcutsLabel = map?.shortcuts?.message || 'Shortcuts';
  const shortcutsBtn = elements.shortcutsBtn;
  if (shortcutsBtn) {
    shortcutsBtn.setAttribute('aria-label', shortcutsLabel);
    const textSpan = shortcutsBtn.querySelector('.footer-btn-text');
    if (textSpan) {
      textSpan.textContent = shortcutsLabel;
    }
  }
}


async function activateTool(toolId) {
  try {
    const { messageRouter } = modules;
    await messageRouter.sendRuntimeMessage(messageRouter.MESSAGE_TYPES.ACTIVATE_TOOL, { toolId });
    
    // Track tool usage
    const currentUsage = state.toolUsage.get(toolId) || 0;
    state.toolUsage.set(toolId, currentUsage + 1);
    await saveToolUsage();
    
    // Re-sort tools to reflect new usage
    applyFilters();
    
    setTimeout(() => window.close(), 80);
  } catch (error) {
    console.error('Toolary popup: failed to activate tool', error);
  }
}

function handleToolContainerClick(event) {
  const card = event.target.closest('.tool-card');
  if (!card) return;
  activateTool(card.dataset.toolId);
}

function attachContainerListeners() {
  document.querySelectorAll('.tools-virtual-container').forEach((container) => {
    container.addEventListener('click', handleToolContainerClick);
  });
}

function handleSearchInput(event) {
  state.searchTerm = event.target.value;
  updateSearchHint();
  applyFilters();
}

function handleCategoryMenuClick(event) {
  const item = event.target.closest('.category-menu-item');
  if (!item) return;
  const category = item.dataset.category;
  if (!category) {
    closeCategoryMenu();
    return;
  }

  if (category === state.activeCategory) {
    closeCategoryMenu();
    return;
  }

  state.activeCategory = category;
  updateCategoryIcon(category);
  closeCategoryMenu();
  applyFilters();
}

function updateCategoryIcon(category) {
  const iconMap = {
    'all': '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    'inspect': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    'capture': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    'enhance': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1-.365-.567L2.5 4.5a.5.5 0 0 1 .567-.365L9.937 5.5A2 2 0 0 0 11.5 6.937l6.135 1.582a.5.5 0 0 1 .365.567L17.5 19.5a.5.5 0 0 1-.567.365L9.937 15.5Z"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>',
    'utilities': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
  };
  
  if (elements.categoryIcon && iconMap[category]) {
    elements.categoryIcon.innerHTML = iconMap[category];
  }
}

function toggleCategoryMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (elements.categoryMenu) {
    const willOpen = elements.categoryMenu.hidden || elements.categoryMenu.classList.contains('hidden');

    if (willOpen) {
      elements.categoryMenu.hidden = false;
      elements.categoryMenu.classList.remove('hidden');
      elements.categoryMenuBtn?.setAttribute('aria-expanded', 'true');

      requestAnimationFrame(() => {
        const firstItem = elements.categoryMenu.querySelector('.category-menu-item');
        firstItem?.focus();
      });
    } else {
      closeCategoryMenu();
    }
  } else {
    closeCategoryMenu();
  }
}

function handleCategoryMenuKeydown(event) {
  if (!elements.categoryMenu) return;

  const items = Array.from(elements.categoryMenu.querySelectorAll('.category-menu-item'));
  if (!items.length) return;

  const currentIndex = items.indexOf(document.activeElement);

  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      items[nextIndex]?.focus();
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      items[nextIndex]?.focus();
      break;
    }
    case 'Home': {
      event.preventDefault();
      items[0]?.focus();
      break;
    }
    case 'End': {
      event.preventDefault();
      items[items.length - 1]?.focus();
      break;
    }
    case 'Escape': {
      event.preventDefault();
      closeCategoryMenu();
      elements.categoryMenuBtn?.focus();
      break;
    }
    case 'Enter':
    case ' ': {
      if (document.activeElement && typeof document.activeElement.click === 'function') {
        event.preventDefault();
        document.activeElement.click();
      }
      break;
    }
    default:
      break;
  }
}

function handleCategoryButtonKeydown(event) {
  if (!elements.categoryMenuBtn) return;
  if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    toggleCategoryMenu(event);
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCategoryMenu();
  }
}

function closeCategoryMenu() {
  if (elements.categoryMenu) {
    elements.categoryMenu.hidden = true;
    elements.categoryMenu.classList.add('hidden');
  }
  elements.categoryMenuBtn?.setAttribute('aria-expanded', 'false');
}



function handleKeyboardNavigation(event) {
  const activeElement = document.activeElement;
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
    event.preventDefault();
    elements.searchInput.focus();
    elements.searchInput.select();
    return;
  }

  // Handle pagination with arrow keys
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    const isInPagination = activeElement?.closest('.pagination');
    if (isInPagination) {
      event.preventDefault();
      if (event.key === 'ArrowLeft') {
        prevPage();
      } else if (event.key === 'ArrowRight') {
        nextPage();
      }
      return;
    }
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    const card = activeElement?.closest('.tool-card');
    if (!card) return;
    event.preventDefault();
    const container = card.closest('.tools-grid');
    if (!container) return;
    const cards = Array.from(container.querySelectorAll('.tool-card:not([style*="visibility: hidden"])'));
    const index = cards.indexOf(card);
    if (index === -1) return;
    const columns = 3; // Fixed 3-column layout
    let nextIndex = index;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = Math.min(cards.length - 1, index + 1);
        break;
      case 'ArrowLeft':
        nextIndex = Math.max(0, index - 1);
        break;
      case 'ArrowDown':
        nextIndex = Math.min(cards.length - 1, index + columns);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(0, index - columns);
        break;
      default:
        break;
    }
    cards[nextIndex]?.focus();
  }
}

function switchSettingsTab(tabName) {
  // Validate tab name
  const validTabs = ['preferences', 'tools', 'about'];
  if (!validTabs.includes(tabName)) {
    console.warn(`Invalid tab name: ${tabName}`);
    return;
  }

  // Hide all content with smooth transition
  document.querySelectorAll('.settings-content').forEach(content => {
    content.classList.remove('active');
    content.setAttribute('aria-hidden', 'true');
    content.setAttribute('tabindex', '-1');
  });
  
  // Remove active from all tabs
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });
  
  // Show selected content
  const content = document.getElementById(`settings-content-${tabName}`);
  if (content) {
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      content.classList.add('active');
      content.setAttribute('aria-hidden', 'false');
      content.setAttribute('tabindex', '0');
    });
  }
  
  // Activate selected tab
  const tab = document.getElementById(`settings-tab-${tabName}`);
  if (tab) {
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    // Focus after a short delay to ensure smooth transition
    setTimeout(() => tab.focus(), 50);
  }
}

function renderSettingsList() {
  const container = elements.settingsToolList;
  if (!container) return;
  container.innerHTML = '';

  const sorted = [...state.toolMetadata].sort((a, b) => a.name.localeCompare(b.name));

  sorted.forEach((tool) => {
    const item = document.createElement('div');
    item.className = 'settings-tool-item';

    const label = document.createElement('div');
    label.className = 'settings-tool-item__label';
    const name = document.createElement('span');
    name.className = 'settings-tool-item__name';
    
    // Get localized name from i18n
    const nameKey = tool.i18n?.label || tool.i18n?.title || tool.id;
    const localizedName = state.langMap[nameKey]?.message || tool.name;
    name.textContent = localizedName;

    const category = document.createElement('span');
    category.className = 'settings-tool-item__category';
    
    // Get localized category name
    const categoryKey = CATEGORY_KEYS[tool.category];
    const localizedCategory = state.langMap[categoryKey]?.message || tool.category;
    category.textContent = localizedCategory;

    label.append(name, category);

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.className = 'toggle';
    toggle.dataset.toolId = tool.id;
    toggle.checked = !pendingHidden.has(tool.id);

    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        pendingHidden.delete(tool.id);
      } else {
        pendingHidden.add(tool.id);
      }
    });

    item.append(label, toggle);
    container.appendChild(item);
  });
}

function openSettingsPanel() {
  // Reset state
  pendingHidden = new Set(state.hiddenTools);
  
  // Show panel first
  elements.settingsPanel.hidden = false;
  elements.settingsPanel.classList.add('is-open');
  elements.settingsBtn.setAttribute('aria-expanded', 'true');
  
  // Initialize settings values
  if (elements.settingsLangSelect) {
    elements.settingsLangSelect.value = state.langMap.__current || 'en';
  }
  if (elements.settingsThemeSelect) {
    elements.settingsThemeSelect.value = currentThemeSetting;
  }
  
  // Render settings list
  renderSettingsList();
  
  // Start with preferences tab after a short delay
  setTimeout(() => {
    switchSettingsTab('preferences');
    
    // Focus first interactive element
    setTimeout(() => {
      const firstToggle = elements.settingsPanel.querySelector('.toggle');
      const firstSelect = elements.settingsPanel.querySelector('select');
      const firstFocusable = firstToggle || firstSelect;
      firstFocusable?.focus();
    }, 100);
  }, 50);
}

function closeSettingsPanel({ save = false } = {}) {
  if (save) {
    state.hiddenTools = new Set(pendingHidden);
    saveHiddenTools();
    applyFilters();
  }
  elements.settingsPanel.classList.remove('is-open');
  elements.settingsPanel.hidden = true;
  elements.settingsBtn.setAttribute('aria-expanded', 'false');
  elements.settingsBtn.focus();
}

function resetSettings() {
  pendingHidden = new Set();
  renderSettingsList();
}


function showShortcutsModal(map = state.langMap) {
  closeShortcutsModal();

  const overlay = document.createElement('div');
  overlay.id = 'popup-shortcuts-overlay';
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('div');
  title.className = 'modal-title';
  title.textContent = map?.shortcutsTitle?.message || 'Keyboard shortcuts';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>';

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';

  const descriptionText = map?.shortcutsDescription?.message || 'Trigger Toolary faster with these shortcuts.';
  const description = document.createElement('p');
  description.className = 'modal-description';
  description.textContent = descriptionText;
  body.appendChild(description);

  const shortcutsList = [
    { label: map?.shortcutOpen?.message || map?.openToolary?.message || 'Open Toolary', key: 'Ctrl+Shift+9' },
    { label: map?.shortcutToggle?.message || 'Toggle popup', key: 'Ctrl+Shift+P' },
    { label: map?.shortcutClose?.message || 'Close popup', key: 'Esc' }
  ];

  state.toolMetadata.forEach((tool) => {
    const shortcut = typeof tool.shortcut === 'object' && tool.shortcut
      ? tool.shortcut.default || tool.shortcut.mac || ''
      : tool.shortcut || '';
    if (!shortcut) return;
    shortcutsList.push({ label: tool.name, key: shortcut });
  });

  const shortcutsSection = document.createElement('div');
  shortcutsSection.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

  shortcutsList.forEach(({ label, key }) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,0.03);border-radius:8px;font-size:13px;';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    labelEl.style.cssText = 'color:var(--toolary-text);font-weight:500;';

    const keyEl = document.createElement('span');
    keyEl.textContent = key;
    keyEl.style.cssText = 'background:var(--toolary-button-bg);border:1px solid var(--toolary-border);padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;color:var(--toolary-text);font-family:monospace;';

    row.append(labelEl, keyEl);
    shortcutsSection.appendChild(row);
  });

  body.appendChild(shortcutsSection);

  modal.append(header, body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const handleOverlayClick = (event) => {
    if (event.target === overlay) {
      closeShortcutsModal();
    }
  };

  closeBtn.addEventListener('click', closeShortcutsModal);
  overlay.addEventListener('click', handleOverlayClick);

  shortcutsOverlay = overlay;
}

function closeShortcutsModal() {
  if (shortcutsOverlay) {
    shortcutsOverlay.remove();
    shortcutsOverlay = null;
  }
}

async function initializeLanguageAndTheme() {
  const stored = await chrome.storage.local.get(['language', 'theme']);
  
  // Language detection and initialization
  let lang = stored?.language ? resolveLanguage(stored.language) : null;
  if (!lang) {
    // Try multiple sources for language detection
    const sources = [
      chrome.i18n?.getUILanguage?.(),
      navigator.language,
      navigator.languages?.[0],
      'en'
    ];
    
    for (const source of sources) {
      if (source) {
        const detected = resolveLanguage(source);
        if (detected && detected !== 'en') {
          lang = detected;
          break;
        }
      }
    }
    
    if (!lang) lang = 'en';
    await chrome.storage.local.set({ language: lang });
  }

  // Theme detection and initialization
  let theme = stored?.theme;
  if (!['light', 'dark', 'system'].includes(theme)) {
    // Auto-detect theme preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'system' : 'system';
    await chrome.storage.local.set({ theme });
  }

  // Load language
  state.langMap = await loadLang(lang);
  state.langMap.__current = lang;
  applyLang(state.langMap);
  updateFooterButtons(state.langMap);

  // Apply theme
  currentThemeSetting = theme;
  applyTheme(theme);
}

async function loadToolMetadata() {
  setLoadingState(true);
  const { toolRegistry } = modules;
  state.toolMetadata = await toolRegistry.getAllTools();
  state.toolMap = new Map(state.toolMetadata.map(tool => [tool.id, tool]));
  setLoadingState(false);
  
  // Apply filters first to set up state.filteredTools
  applyFilters();
  renderSettingsList();
}

function attachEventListeners() {
  elements.searchInput?.addEventListener('input', handleSearchInput);

  if (elements.categoryMenuBtn) {
    elements.categoryMenuBtn.addEventListener('click', (event) => {
      toggleCategoryMenu(event);
    });
    elements.categoryMenuBtn.addEventListener('keydown', handleCategoryButtonKeydown);
  }
  
  if (elements.categoryMenu) {
    elements.categoryMenu.addEventListener('click', handleCategoryMenuClick);
    elements.categoryMenu.addEventListener('keydown', handleCategoryMenuKeydown);
  }
  
  // Close category menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!elements.categoryMenuBtn?.contains(event.target) && !elements.categoryMenu?.contains(event.target)) {
      closeCategoryMenu();
    }
  });

  elements.settingsShortcutsBtn?.addEventListener('click', () => showShortcutsModal());

  // Settings tab event listeners
  elements.settingsTabPreferences?.addEventListener('click', () => switchSettingsTab('preferences'));
  elements.settingsTabTools?.addEventListener('click', () => switchSettingsTab('tools'));
  elements.settingsTabAbout?.addEventListener('click', () => switchSettingsTab('about'));

  // Settings language and theme change handlers
  elements.settingsLangSelect?.addEventListener('change', async (event) => {
    const newLang = resolveLanguage(event.target.value);
    event.target.value = newLang;
    await chrome.storage.local.set({ language: newLang });
    state.langMap = await loadLang(newLang);
    state.langMap.__current = newLang;
    applyLang(state.langMap);
    updateFooterButtons(state.langMap);
    applyFilters();
  });

  elements.settingsThemeSelect?.addEventListener('change', async (event) => {
    const requested = event.target.value;
    const normalized = ['light', 'dark', 'system'].includes(requested) ? requested : 'system';
    event.target.value = normalized;
    await chrome.storage.local.set({ theme: normalized });
    currentThemeSetting = normalized;
    applyTheme(normalized);
  });

  elements.settingsBtn?.addEventListener('click', openSettingsPanel);
  elements.settingsClose?.addEventListener('click', () => closeSettingsPanel({ save: false }));
  elements.settingsReset?.addEventListener('click', resetSettings);
  elements.settingsSave?.addEventListener('click', () => {
    closeSettingsPanel({ save: true });
    ui.showToast('Tool visibility updated', 'success');
  });
  elements.settingsPanel?.addEventListener('click', (event) => {
    if (event.target === elements.settingsPanel) {
      closeSettingsPanel({ save: false });
    }
  });

  // Pagination event listeners
  elements.prevPage?.addEventListener('click', prevPage);
  elements.nextPage?.addEventListener('click', nextPage);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (shortcutsOverlay) {
        event.preventDefault();
        closeShortcutsModal();
        return;
      }
      if (!elements.settingsPanel.hidden) {
        event.preventDefault();
        closeSettingsPanel({ save: false });
        return;
      }
      window.close();
    }
  });

  document.addEventListener('keydown', handleKeyboardNavigation);
}

document.addEventListener('DOMContentLoaded', async () => {
  if (state.isInitialized) return;
  state.isInitialized = true;

  const [{ toolRegistry, messageRouter }, uiModule, iconsModule] = await Promise.all([
    coreModulesPromise,
    uiComponentsPromise,
    iconsPromise
  ]);
  Object.assign(modules, { toolRegistry, messageRouter });
  Object.assign(ui, uiModule);
  Object.assign(icons, iconsModule);

  cacheElements();
  updateVersionBadge();
  attachContainerListeners();
  attachEventListeners();

  await initializeLanguageAndTheme();
  await loadPreferences();
  await loadToolMetadata();
  updateCategoryIcon(state.activeCategory);
  updateSearchHint();
  renderToolLists();
});
