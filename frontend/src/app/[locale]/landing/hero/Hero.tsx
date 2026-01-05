import React from "react";
import { SearchBar } from "@/components/SearchBar";
import { Typography } from "@/components/Typography";
import StatsCompaniesIcon from "@/icons/StatsCompaniesIcon";
import StatsReviewsIcon from "@/icons/StatsReviewsIcon";
import StatsCountriesIcon from "@/icons/StatsCountriesIcon";
import StatsSourcesIcon from "@/icons/StatsSourcesIcon";
import styles from "./Hero.module.scss";

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
            <div className={styles.statNumber}>15,000+</div>
            <div className={styles.statText}>Проверенных компаний</div>
          </div>
          <div className={styles.statItem}>
            <StatsReviewsIcon
              className={`${styles.statIcon} ${styles.statIconReviews}`}
            />
            <div className={styles.statNumber}>13M</div>
            <div className={styles.statText}>Отзывов клиентов</div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <StatsCountriesIcon
              className={`${styles.statIcon} ${styles.statIconCountries}`}
            />
            <div className={styles.statNumber}>18</div>
            <div className={styles.statText}>Стран охвата</div>
          </div>
          <div className={styles.statItem}>
            <StatsSourcesIcon
              className={`${styles.statIcon} ${styles.statIconSources}`}
            />
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statText}>Проверенные источники</div>
          </div>
        </div>
      </div>
    </section>
  );
}
