"use client";

import { SearchBar } from "@/components/SearchBar";
import { Typography } from "@/components/Typography";
import StatsCompaniesIcon from "@/icons/StatsCompaniesIcon";
import StatsReviewsIcon from "@/icons/StatsReviewsIcon";
import StatsCountriesIcon from "@/icons/StatsCountriesIcon";
import StatsSourcesIcon from "@/icons/StatsSourcesIcon";
import styles from "./Hero.module.scss";
import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import type { HeroContent } from "@/types/landing";

type StatFormat = "int" | "comma";

function AnimatedStatNumber({
  to,
  format,
  suffix,
}: {
  to: number;
  format: StatFormat;
  suffix?: string;
}) {
  const value = useMotionValue(0);

  useEffect(() => {
    const controls = animate(value, to, {
      duration: 0.9,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [to, value]);

  const text = useTransform(value, (latest) => {
    const rounded = Math.max(0, Math.round(latest));
    const base =
      format === "comma" ? rounded.toLocaleString("en-US") : String(rounded);
    return `${base}${suffix ?? ""}`;
  });

  return <motion.span>{text}</motion.span>;
}

function getStatFormat(value: number): StatFormat {
  return value >= 1000 ? "comma" : "int";
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className={styles.hero}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={28}
          desktopSize={32}
          text={content.title}
          highlight={content.title_highlight ?? undefined}
        />
        <Typography
          as="h2"
          size={20}
          desktopSize={20}
          text={content.subtitle}
        />
      </div>
      <SearchBar />
      <div className={styles.statistics}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <StatsCompaniesIcon
              className={`${styles.statIcon} ${styles.statIconCompanies}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber
                to={content.stat_companies_value}
                format={getStatFormat(content.stat_companies_value)}
                suffix={content.stat_companies_suffix ?? undefined}
              />
            </div>
            <div className={styles.statText}>{content.stat_companies_label}</div>
          </div>
          <div className={styles.statItem}>
            <StatsReviewsIcon
              className={`${styles.statIcon} ${styles.statIconReviews}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber
                to={content.stat_reviews_value}
                format={getStatFormat(content.stat_reviews_value)}
                suffix={content.stat_reviews_suffix ?? undefined}
              />
            </div>
            <div className={styles.statText}>{content.stat_reviews_label}</div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <StatsCountriesIcon
              className={`${styles.statIcon} ${styles.statIconCountries}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber
                to={content.stat_countries_value}
                format={getStatFormat(content.stat_countries_value)}
                suffix={content.stat_countries_suffix ?? undefined}
              />
            </div>
            <div className={styles.statText}>{content.stat_countries_label}</div>
          </div>
          <div className={styles.statItem}>
            <StatsSourcesIcon
              className={`${styles.statIcon} ${styles.statIconSources}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber
                to={content.stat_sources_value}
                format={getStatFormat(content.stat_sources_value)}
                suffix={content.stat_sources_suffix ?? undefined}
              />
            </div>
            <div className={styles.statText}>{content.stat_sources_label}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
