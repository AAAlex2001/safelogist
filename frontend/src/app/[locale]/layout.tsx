import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Header from "../../components/header/Header";

const montserrat = Montserrat({
  variable: "--font-base",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SafeLogist — Проверенная информация о логистических компаниях",
  description: "Честные отзывы о логистических компаниях, проверка надежности партнеров и подрядчиков. Безопасные решения для вашего бизнеса.",
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
  
  // Проверяем, что локаль поддерживается
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  // Устанавливаем локаль для static rendering
  setRequestLocale(locale);
  
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <body className={montserrat.variable}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
