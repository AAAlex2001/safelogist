"use client";

import Link from "next/link";
import styles from "../admin.module.scss";

const landingSections = [
  { href: "/admin/landing/hero", label: "Hero секция", description: "Заголовок, подзаголовок и статистика" },
  // Будущие секции:
  // { href: "/admin/landing/functions", label: "Функции", description: "Блок с функциями сервиса" },
  // { href: "/admin/landing/steps", label: "Шаги", description: "Как это работает" },
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
