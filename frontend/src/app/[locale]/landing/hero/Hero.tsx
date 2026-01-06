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

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={28}
          desktopSize={32}
          text="Проверь репутацию любой компании всего за минуту"
          highlight="любой компании"
        />
        <Typography
          as="h2"
          size={20}
          desktopSize={20}
          text="Просматривайте и анализируйте досье, чтобы быстро оценить надёжность компании и принимать обоснованные решения"
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
              <AnimatedStatNumber to={15000} format="comma" suffix="+" />
            </div>
            <div className={styles.statText}>Проверенных компаний</div>
          </div>
          <div className={styles.statItem}>
            <StatsReviewsIcon
              className={`${styles.statIcon} ${styles.statIconReviews}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber to={13} format="int" suffix="M" />
            </div>
            <div className={styles.statText}>Отзывов клиентов</div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <StatsCountriesIcon
              className={`${styles.statIcon} ${styles.statIconCountries}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber to={18} format="int" />
            </div>
            <div className={styles.statText}>Стран охвата</div>
          </div>
          <div className={styles.statItem}>
            <StatsSourcesIcon
              className={`${styles.statIcon} ${styles.statIconSources}`}
            />
            <div className={styles.statNumber}>
              <AnimatedStatNumber to={100} format="int" suffix="%" />
            </div>
            <div className={styles.statText}>Проверенные источники</div>
          </div>
        </div>
      </div>
    </section>
  );
}
