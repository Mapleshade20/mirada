import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN', // Default language is Chinese
    fallbackLng: 'zh-CN',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;