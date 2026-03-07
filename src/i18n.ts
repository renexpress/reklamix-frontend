import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationUZ from './locales/uz.json';
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationTR from './locales/tr.json';

const resources = {
  uz: {
    translation: translationUZ
  },
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  },
  tr: {
    translation: translationTR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    supportedLngs: ['uz', 'en', 'ru', 'tr'],
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
