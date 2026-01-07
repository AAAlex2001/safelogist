import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Header from "../../components/header/Header";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TelegramWebApp } from "@/components/telegram/TelegramWebApp";

const montserrat = Montserrat({
  variable: "--font-base",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SafeLogist — Проверенная информация о логистических компаниях",
  description: "Сервис проверки и анализа транспортных и логистических компаний. Отзывы, судебные дела и оценка рисков сотрудничества на основе данных из официальных источников — SafeLogist.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  setRequestLocale(locale);
  
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <head>
        <link rel="alternate" hrefLang="ru" href="https://safelogist.com/ru" />
        <link rel="alternate" hrefLang="en" href="https://safelogist.com/en" />
        <link rel="alternate" hrefLang="uk" href="https://safelogist.com/uk" />
        <link rel="alternate" hrefLang="ro" href="https://safelogist.com/ro" />
        <link rel="alternate" hrefLang="x-default" href="https://safelogist.com/en" />
      </head>
      <body className={montserrat.variable}>
        <TelegramWebApp />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
