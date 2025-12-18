import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Страница в разработке</h1>
          <p className={styles.subtitle}>
            А пока вы можете посмотреть отзывы о компаниях{" "}
            <a
              href="https://safelogist.net/ru/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              по этой ссылке
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
