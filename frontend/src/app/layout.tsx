import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "../components/header/Header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
