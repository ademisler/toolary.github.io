// AI Manager Service for Toolary
// Handles API key rotation, model selection, and Gemini API calls

import { GEMINI_MODELS, AI_LANGUAGE_NAMES, getModelForTool, AI_API_CONFIG } from './aiConfig.js';
import { handleError } from '../shared/helpers.js';
import { encryptAIKeyEntries, decryptAIKeyEntries } from './secureStorage.js';

class AIManager {
  constructor() {
    this.apiKeys = [];
    this.currentKeyIndex = 0;
    this.keyStatus = new Map(); // Track key health and rate limits
    this.userModelPreference = 'auto';
    this.userLanguagePreference = 'auto';
    this.isInitialized = false;
  }

  // Initialize the AI manager
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.loadAPIKeys();
      await this.loadUserPreferences();
      this.isInitialized = true;
    } catch (error) {
      handleError(error, 'AIManager.initialize');
      throw error;
    }
  }

  // Load API keys from storage
  async loadAPIKeys() {
    try {
      const result = await chrome.storage.local.get(['toolaryAIKeys']);
      const storedKeys = Array.isArray(result.toolaryAIKeys) ? result.toolaryAIKeys : [];
      const decryptedKeys = await decryptAIKeyEntries(storedKeys);
      this.apiKeys = decryptedKeys.map((entry) => ({
        value: entry.value || '',
        createdAt: entry.createdAt || Date.now()
      }));

      // Initialize key status for new keys
      this.apiKeys.forEach((key, index) => {
        if (!this.keyStatus.has(index)) {
          this.keyStatus.set(index, {
            isHealthy: true,
            lastUsed: 0,
            errorCount: 0,
            rateLimitedUntil: 0
          });
        }
      });
    } catch (error) {
      handleError(error, 'AIManager.loadAPIKeys');
      this.apiKeys = [];
    }
  }

  // Save API keys to storage
  async saveAPIKeys(keys) {
    try {
      this.apiKeys = keys.map((key) => ({
        value: key.value || '',
        createdAt: key.createdAt || Date.now()
      }));

      const storedKeys = await encryptAIKeyEntries(this.apiKeys);
      await chrome.storage.local.set({ toolaryAIKeys: storedKeys });

      // Update key status map
      this.keyStatus.clear();
      keys.forEach((_, index) => {
        this.keyStatus.set(index, {
          isHealthy: true,
          lastUsed: 0,
          errorCount: 0,
          rateLimitedUntil: 0
        });
      });
    } catch (error) {
      handleError(error, 'AIManager.saveAPIKeys');
      throw error;
    }
  }

  // Load user preferences from storage
  async loadUserPreferences() {
    try {
      const result = await chrome.storage.local.get(['toolaryAIModel', 'toolaryAILanguage']);
      this.userModelPreference = result.toolaryAIModel || 'auto';
      this.userLanguagePreference = result.toolaryAILanguage || 'auto';
    } catch (error) {
      handleError(error, 'AIManager.loadUserPreferences');
      this.userModelPreference = 'auto';
      this.userLanguagePreference = 'auto';
    }
  }

  // Get next available API key with smart rotation
  getNextAvailableKey() {
    if (this.apiKeys.length === 0) {
      return null;
    }

    const now = Date.now();
    const healthyKeys = [];

    // Find all healthy keys that are not rate limited
    for (let i = 0; i < this.apiKeys.length; i++) {
      const status = this.keyStatus.get(i);
      if (status && status.isHealthy && status.rateLimitedUntil <= now) {
        healthyKeys.push({ index: i, key: this.apiKeys[i], status });
      }
    }

    if (healthyKeys.length === 0) {
      return null;
    }

    // Sort by last used time (least recently used first)
    healthyKeys.sort((a, b) => a.status.lastUsed - b.status.lastUsed);

    // Update last used time
    const selectedKey = healthyKeys[0];
    selectedKey.status.lastUsed = now;

    return selectedKey;
  }

  // Select appropriate model for tool
  selectModel(toolId, userPreference = null) {
    const preference = userPreference || this.userModelPreference;
    return getModelForTool(toolId, preference);
  }

  // Select appropriate language for AI responses
  async selectLanguage(userPreference = null) {
    const preference = userPreference || this.userLanguagePreference;
    
    if (preference === 'auto') {
      try {
        // First, try to read from popup language preference
        const stored = await chrome.storage.local.get(['language']);
        if (stored?.language) {
          return stored.language;
        }
        
        // Fallback: detect browser language
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        const langCode = browserLang.split('-')[0];
        
        // Check if supported, otherwise English
        if (['en', 'tr', 'fr'].includes(langCode)) {
          return langCode;
        }
        
        return 'en';
      } catch (error) {
        console.error('AI Manager: Error reading language preference:', error);
        return 'en';
      }
    }
    
    return preference;
  }

  // Get language instruction for prompt
  async getLanguageInstruction(userPreference = null) {
    const language = await this.selectLanguage(userPreference);
    
    if (language === 'auto') {
      return '';
    }
    
    const languageName = AI_LANGUAGE_NAMES[language];
    if (languageName) {
      return `\n\nPlease respond in ${languageName}.`;
    }
    
    return '';
  }

  // Handle API errors and update key status
  handleAPIError(error, keyIndex) {
    const status = this.keyStatus.get(keyIndex);
    if (!status) return;

    status.errorCount++;
    
    // Mark key as unhealthy after too many errors
    if (status.errorCount >= 3) {
      status.isHealthy = false;
      console.warn(`API key ${keyIndex} marked as unhealthy after ${status.errorCount} errors`);
    }

    // Handle rate limiting
    if (error.message && error.message.includes('429')) {
      status.rateLimitedUntil = Date.now() + AI_API_CONFIG.RATE_LIMIT.COOLDOWN_PERIOD;
      console.warn(`API key ${keyIndex} rate limited until ${new Date(status.rateLimitedUntil)}`);
    }
  }

  // Reset key status after successful use
  resetKeyStatus(keyIndex) {
    const status = this.keyStatus.get(keyIndex);
    if (status) {
      status.errorCount = 0;
      status.isHealthy = true;
    }
  }

  // Main API call method with retry logic
  async callGeminiAPI(prompt, options = {}) {
    const {
      toolId = 'unknown',
      maxRetries = AI_API_CONFIG.RETRY.MAX_ATTEMPTS,
      userModelPreference = null,
      userLanguagePreference = null
    } = options;

    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.apiKeys.length === 0) {
      throw new Error('No API keys configured. Please add at least one Gemini API key in settings.');
    }

    const model = this.selectModel(toolId, userModelPreference);
    const languageInstruction = await this.getLanguageInstruction(userLanguagePreference);
    const enhancedPrompt = prompt + languageInstruction;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const keyData = this.getNextAvailableKey();
      
      if (!keyData) {
        throw new Error('No available API keys. All keys may be rate limited or unhealthy.');
      }

      try {
        const response = await this.makeAPIRequest(enhancedPrompt, model, keyData.key.value);
        
        // Reset key status on success
        this.resetKeyStatus(keyData.index);
        
        return response;
      } catch (error) {
        lastError = error;
        this.handleAPIError(error, keyData.index);
        
        // Add exponential backoff delay
        if (attempt < maxRetries - 1) {
          const delay = AI_API_CONFIG.RETRY.BACKOFF_DELAY * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('API call failed after all retries');
  }

  // Make actual API request to Gemini
  async makeAPIRequest(prompt, model, apiKey) {
    const url = `${AI_API_CONFIG.BASE_URL}/models/${model}:generateContent`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status}`;
      
      if (response.status === 429) {
        errorMessage = 'Rate limit exceeded';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request - check your API key and prompt';
      } else if (response.status === 403) {
        errorMessage = 'API key invalid or insufficient permissions';
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  // Get API key status for UI display
  getAPIKeyStatus() {
    const now = Date.now();
    return this.apiKeys.map((key, index) => {
      const status = this.keyStatus.get(index);
      if (!status) {
        return { index, status: 'unknown', isHealthy: false };
      }

      let statusText = 'active';
      if (!status.isHealthy) {
        statusText = 'error';
      } else if (status.rateLimitedUntil > now) {
        statusText = 'rate_limited';
      }

      return {
        index,
        status: statusText,
        isHealthy: status.isHealthy,
        errorCount: status.errorCount,
        rateLimitedUntil: status.rateLimitedUntil
      };
    });
  }

  // Update user model preference
  async setUserModelPreference(preference) {
    this.userModelPreference = preference;
    try {
      await chrome.storage.local.set({ toolaryAIModel: preference });
    } catch (error) {
      handleError(error, 'AIManager.setUserModelPreference');
    }
  }

  // Update user language preference
  async setUserLanguagePreference(preference) {
    this.userLanguagePreference = preference;
    try {
      await chrome.storage.local.set({ toolaryAILanguage: preference });
    } catch (error) {
      handleError(error, 'AIManager.setUserLanguagePreference');
    }
  }

  // Test API key validity
  async testAPIKey(apiKey) {
    try {
      const testPrompt = 'Hello, please respond with "API test successful"';
      const response = await this.makeAPIRequest(testPrompt, GEMINI_MODELS.LITE, apiKey);
      
      // Check if response contains expected content
      if (response && response.toLowerCase().includes('successful')) {
        return { valid: true, error: null, response: response };
      } else {
        return { valid: true, error: null, response: 'API key is working' };
      }
    } catch (error) {
      let errorMessage = error.message;
      
      // Translate common error messages
      if (errorMessage.includes('Rate limit exceeded')) {
        errorMessage = 'Rate limit exceeded';
      } else if (errorMessage.includes('Invalid request')) {
        errorMessage = 'Invalid API key format';
      } else if (errorMessage.includes('API key invalid')) {
        errorMessage = 'API key is invalid or expired';
      } else if (errorMessage.includes('insufficient permissions')) {
        errorMessage = 'API key has insufficient permissions';
      }
      
      return { valid: false, error: errorMessage };
    }
  }
}

// Export singleton instance
export const aiManager = new AIManager();
