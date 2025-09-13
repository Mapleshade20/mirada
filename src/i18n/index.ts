import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
// Import translation files
import zhCN from "./locales/zh-CN.json";

const resources = {
  "zh-CN": {
    translation: zhCN,
  },
  "en-US": {
    translation: enUS,
  },
};

// Get language from localStorage or default to Chinese
const savedLanguage = localStorage.getItem("i18nextLng") || "zh-CN";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "zh-CN",

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
});

// Save language changes to localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
