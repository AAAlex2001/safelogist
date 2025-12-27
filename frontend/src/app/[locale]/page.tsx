import styles from "../page.module.css";

export default function LocaleHome() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Проверенная информация<br />
              о <span className={styles.gradient}>логистических компаниях</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Честные отзывы партнёров и подрядчиков помогут вам принять правильное решение
            </p>
            <div className={styles.heroCta}>
              <a
                href="https://safelogist.net/ru/reviews"
                className={styles.primaryButton}
              >
                Посмотреть отзывы
              </a>
              <a
                href="https://safelogist.net/ru/reviews"
                className={styles.secondaryButton}
              >
                Узнать больше
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="100" width="120" height="80" rx="8" fill="url(#gradient1)" opacity="0.8"/>
              <rect x="190" y="80" width="120" height="100" rx="8" fill="url(#gradient2)" opacity="0.9"/>
              <rect x="330" y="110" width="40" height="60" rx="6" fill="url(#gradient3)" opacity="0.7"/>
              <circle cx="120" cy="50" r="12" fill="#012AF9" opacity="0.6"/>
              <circle cx="250" cy="40" r="8" fill="#012AF9" opacity="0.4"/>
              <circle cx="340" cy="70" r="10" fill="#012AF9" opacity="0.5"/>
              <path d="M120 60 L250 50 L340 80" stroke="#012AF9" strokeWidth="2" strokeDasharray="5,5" opacity="0.3"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#012AF9" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#4d7bff" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#012AF9" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#4d7bff" stopOpacity="0.4"/>
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#012AF9" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#4d7bff" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2 className={styles.featuresTitle}>Почему SafeLogist?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L4 10L16 16L28 10L16 4Z" fill="#012AF9" opacity="0.2"/>
                  <path d="M4 22L16 28L28 22M4 16L16 22L28 16" stroke="#012AF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Честные отзывы</h3>
              <p className={styles.featureDesc}>
                Реальные отзывы от партнёров и клиентов логистических компаний
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" fill="#012AF9" opacity="0.2"/>
                  <path d="M16 8V16L21 19" stroke="#012AF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Ежедневные обновления</h3>
              <p className={styles.featureDesc}>
                База данных обновляется каждый день — всегда актуальная информация
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="6" width="20" height="20" rx="4" fill="#012AF9" opacity="0.2"/>
                  <path d="M12 16L15 19L20 13" stroke="#012AF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Проверенные данные</h3>
              <p className={styles.featureDesc}>
                Вся информация проходит модерацию для вашей безопасности
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4C16 4 24 8 24 16C24 24 16 28 16 28C16 28 8 24 8 16C8 8 16 4 16 4Z" fill="#012AF9" opacity="0.2"/>
                  <path d="M16 4C16 4 24 8 24 16C24 24 16 28 16 28C16 28 8 24 8 16C8 8 16 4 16 4Z" stroke="#012AF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Безопасный выбор</h3>
              <p className={styles.featureDesc}>
                Принимайте решения на основе опыта других компаний
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Готовы проверить компанию?</h2>
          <p className={styles.ctaSubtitle}>
            Узнайте, что говорят о ваших потенциальных партнерах
          </p>
          <a
            href="https://safelogist.net/ru/reviews"
            className={styles.ctaButton}
          >
            Начать поиск
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 SafeLogist. Все права защищены.</p>
      </footer>
    </div>
  );
}
