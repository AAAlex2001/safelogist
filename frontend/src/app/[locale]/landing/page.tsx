import React from "react";
import { SearchBar } from "@/components/SearchBar";
import styles from "./landing.module.scss";

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <section className={styles.hero}>
        {/* Заголовок */}
        <div className={styles.headings}>
          <h1 className={styles.title}>
            Проверь репутацию <span className={styles.highlight}>любой компании</span> всего за минуту
          </h1>
          <p className={styles.subtitle}>
            Просматривайте и анализируйте досье, чтобы быстро оценить надёжность компании и принимать обоснованные решения
          </p>
        </div>

        {/* Поисковая строка */}
        <SearchBar />

        {/* Статистика */}
        <div className={styles.statistics}>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>15,000+</div>
              <div className={styles.statText}>Проверенных компаний</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>13M</div>
              <div className={styles.statText}>Отзывов клиентов</div>
            </div>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>18</div>
              <div className={styles.statText}>Стран охвата</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statText}>Проверенные источники</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
