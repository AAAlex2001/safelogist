import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SafeLogist — Проверенная информация о логистических компаниях",
  description: "Честные отзывы о логистических компаниях, проверка надежности партнеров и подрядчиков. Безопасные решения для вашего бизнеса.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
