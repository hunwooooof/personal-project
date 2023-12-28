import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../assets/i18n/en.json';
import tw from '../assets/i18n/zh-TW.json';

const resources = {
  en: {
    translation: en,
  },
  'zh-TW': {
    translation: tw,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'zh-TW',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
