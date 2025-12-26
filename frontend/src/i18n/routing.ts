import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Поддерживаемые языки
  locales: ['ru', 'en', 'ro', 'uk'],
  
  // Язык по умолчанию
  defaultLocale: 'ru'
});
