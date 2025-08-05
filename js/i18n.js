// Internationalization system for Labratorium AI Prompt Optimizer
class I18n {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.fallbackLanguage = 'en';
  }
  
  async init() {
    // Detect and load user's preferred language
    const userLanguage = await this.detectUserLanguage();
    await this.loadLanguage(userLanguage);
    await this.loadLanguage(this.fallbackLanguage); // Always load English as fallback
  }
  
  async detectUserLanguage() {
    try {
      // 1. Check saved preference
      const saved = await chrome.storage.local.get(['language']);
      if (saved.language && this.isLanguageSupported(saved.language)) {
        return saved.language;
      }
      
      // 2. Check browser language
      const browserLang = navigator.language || navigator.userLanguage;
      const langCode = this.extractLanguageCode(browserLang);
      
      // 3. Return supported language or default to English
      return this.isLanguageSupported(langCode) ? langCode : 'en';
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en';
    }
  }
  
  extractLanguageCode(locale) {
    // Handle special cases like zh-CN
    if (locale.toLowerCase().startsWith('zh-cn') || locale.toLowerCase().startsWith('zh_cn')) {
      return 'zh-CN';
    }
    
    // Extract base language code
    return locale.split('-')[0].split('_')[0].toLowerCase();
  }
  
  isLanguageSupported(langCode) {
    return languages && languages[langCode];
  }
  
  async loadLanguage(languageCode) {
    if (!languageCode || this.translations[languageCode]) {
      return; // Already loaded
    }
    
    try {
      const response = await fetch(chrome.runtime.getURL(`locales/${languageCode}.json`));
      if (response.ok) {
        this.translations[languageCode] = await response.json();
      } else {
        console.warn(`Failed to load language ${languageCode}`);
      }
    } catch (error) {
      console.error(`Error loading language ${languageCode}:`, error);
    }
  }
  
  async setLanguage(languageCode) {
    if (!this.isLanguageSupported(languageCode)) {
      console.warn(`Language ${languageCode} not supported`);
      return false;
    }
    
    await this.loadLanguage(languageCode);
    this.currentLanguage = languageCode;
    
    // Save preference
    try {
      await chrome.storage.local.set({ language: languageCode });
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
    
    return true;
  }
  
  t(key, params = {}) {
    const translation = this.getTranslation(key, this.currentLanguage) || 
                       this.getTranslation(key, this.fallbackLanguage) || 
                       key;
    
    return this.interpolateParams(translation, params);
  }
  
  getTranslation(key, languageCode) {
    const translations = this.translations[languageCode];
    if (!translations) return null;
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return typeof value === 'string' ? value : null;
  }
  
  interpolateParams(text, params) {
    if (typeof text !== 'string' || Object.keys(params).length === 0) {
      return text;
    }
    
    return text.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  isRTL() {
    return languages[this.currentLanguage]?.rtl || false;
  }
  
  getLanguageInfo() {
    return languages[this.currentLanguage] || languages['en'];
  }
}

// Global instance
const i18n = new I18n();