"use client";

import React, { useState } from "react";
import styles from "./Tariffs.module.scss";
import { Typography } from "@/components/Typography";
import { TariffCard } from "@/components/TariffCard";

export function Tariffs() {
  const [hoveredCard, setHoveredCard] = useState<"base" | "photo" | "pro" | null>(null);

  const baseFeatures = [
    "Проверка компаний",
    "Финансовые отчеты",
    "Базовая аналитика",
  ];

  const proFeatures = [
    "Все функции Base",
    "Расширенная аналитика",
    "Приоритетная поддержка",
    "API доступ",
  ];

  const photoFeatures = [
    "Проверка по фото",
    "Сопоставление изображений",
    "Анализ документов",
  ];

  const isBaseActive = hoveredCard === "base";
  const isPhotoActive = hoveredCard === "photo";
  const isProActive = hoveredCard === null || hoveredCard === "pro";

  return (
    <section className={styles.tariffs}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Тарифы"
        />
        <Typography
          as="h2"
          size={18}
          desktopSize={18}
          brown={true}
          text="Выберите подходящий план"
        />
      </div>
      <div className={styles.cards}>
        <TariffCard
          badgeText="Базовый"
          title="Base"
          price="$50"
          period="/месяц"
          note="Для большинства бизнесов"
          features={baseFeatures}
          ctaText="Выбрать"
          active={isBaseActive}
          onMouseEnter={() => setHoveredCard("base")}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <TariffCard
          popular
          badgeText="Популярный"
          title="Pro"
          price="$100"
          period="/месяц"
          note="Для растущих компаний"
          features={proFeatures}
          ctaText="Выбрать"
          active={isProActive}
          onMouseEnter={() => setHoveredCard("pro")}
          onMouseLeave={() => setHoveredCard(null)}
        />
        <TariffCard
          badgeText="Новинка"
          title="По фото"
          price="$54"
          period="/месяц"
          note="Проверка по изображению"
          features={photoFeatures}
          ctaText="Выбрать"
          active={isPhotoActive}
          onMouseEnter={() => setHoveredCard("photo")}
          onMouseLeave={() => setHoveredCard(null)}
        />
      </div>
    </section>
  );
}
