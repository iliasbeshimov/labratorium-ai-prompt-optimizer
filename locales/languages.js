// Language configuration for Labratorium AI Prompt Optimizer
const languages = {
  en: { name: "English", nativeName: "English", rtl: false },
  es: { name: "Spanish", nativeName: "Español", rtl: false },
  "zh-CN": { name: "Chinese (Simplified)", nativeName: "中文 (简体)", rtl: false },
  fr: { name: "French", nativeName: "Français", rtl: false },
  de: { name: "German", nativeName: "Deutsch", rtl: false },
  pt: { name: "Portuguese", nativeName: "Português", rtl: false },
  ja: { name: "Japanese", nativeName: "日本語", rtl: false },
  ko: { name: "Korean", nativeName: "한국어", rtl: false },
  ru: { name: "Russian", nativeName: "Русский", rtl: false },
  ar: { name: "Arabic", nativeName: "العربية", rtl: true }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = languages;
}