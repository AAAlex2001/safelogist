"use client";

import Link from "next/link";
import styles from "../admin.module.scss";

const landingSections = [
  { href: "/admin/landing/hero", label: "Hero", description: "Заголовок, подзаголовок и статистика" },
  { href: "/admin/landing/review-cta", label: "ReviewCta", description: "Призыв к действию - оставить отзыв" },
  { href: "/admin/landing/functions", label: "Functions", description: "Блок с функциями сервиса" },
  { href: "/admin/landing/steps", label: "Steps", description: "3 шага - как это работает" },
  { href: "/admin/landing/reviews", label: "Reviews", description: "Заголовок секции отзывов" },
  { href: "/admin/landing/bot", label: "Bot", description: "Telegram бот - контент и ссылки" },
  { href: "/admin/landing/tariffs", label: "Tariffs", description: "Тарифы - 3 карточки" },
  { href: "/admin/landing/faq", label: "FAQ", description: "Часто задаваемые вопросы" },
];

export default function LandingAdminPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Управление лендингом</h1>
      <p style={{ marginBottom: 24, color: "#666" }}>
        Выберите секцию для редактирования контента на 4 языках (RU, EN, UK, RO)
      </p>
      <div className={styles.sectionsGrid}>
        {landingSections.map((section) => (
          <Link key={section.href} href={section.href} className={styles.sectionCard}>
            <h3>{section.label}</h3>
            <p>{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
