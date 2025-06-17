import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "en", // Default language
    fallbackLng: "en",
    debug: true,
    
    interpolation: {
      escapeValue: false,
    },
    
    returnObjects: true,
    parseMissingKeyHandler: (key) => {
      return key;
    },
    
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
  });

export default i18n;
