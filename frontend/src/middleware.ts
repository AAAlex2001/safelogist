import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Обрабатывать все пути, кроме API, статики и системных
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
