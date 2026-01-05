"use client";

import React, { useState } from "react";
import styles from "./Tariffs.module.scss";
import { Typography } from "@/components/Typography";
import { TariffCard } from "@/components/TariffCard";

export function Tariffs() {
  const [hoveredCard, setHoveredCard] = useState<"base" | "pro" | null>(null);

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

  // Если ничего не наведено - популярный активен
  // Если наведен base - base активен, popular не активен
  // Если наведен pro - pro активен
  const isBaseActive = hoveredCard === "base";
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
          text="Выберите подходящий план"
        />
      </div>
      <div className={styles.cards}>
        <TariffCard
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
          badgeText="ПОПУЛЯРНЫЙ"
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
      </div>
    </section>
  );
}
