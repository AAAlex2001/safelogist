"use client";

import { useState } from "react";
import styles from "./Tariffs.module.scss";
import { Typography } from "@/components/Typography";
import { TariffCard } from "@/components/TariffCard";
import type { TariffsContent } from "@/types/landing";

type Props = {
  content: TariffsContent;
};

export function Tariffs({ content }: Props) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const data = content;

  return (
    <section className={styles.tariffs}>
      <div className={styles.headings}>
        <Typography as="h1" size={24} desktopSize={24} blue={true} text={data.title} />
        <Typography as="h2" size={18} desktopSize={18} brown={true} text={data.subtitle} />
      </div>
      <div className={styles.cards}>
        {data.cards.map((card, index) => {
          const isActive = hoveredCard === null ? card.popular : hoveredCard === index;
          return (
            <TariffCard
              key={index}
              popular={card.popular}
              badgeText={card.badge}
              title={card.title}
              price={card.price}
              period={card.period}
              note={card.note}
              features={card.features}
              ctaText={card.cta}
              active={isActive}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            />
          );
        })}
      </div>
    </section>
  );
}
