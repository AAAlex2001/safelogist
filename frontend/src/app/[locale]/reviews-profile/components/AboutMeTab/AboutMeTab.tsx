"use client";

import { useTranslations } from "next-intl";
import styles from "../../reviews.module.scss";
import { useReviews } from "../../store";
import { ReviewCard } from "../ReviewCard/ReviewCard";
import { Pagination } from "../Pagination/Pagination";

export function AboutMeTab() {
  const t = useTranslations("Reviews");
  const { state, loadAboutMeReviews } = useReviews();
  const { reviews, total, page, totalPages, companyName } = state.aboutMe;

  const handlePageChange = (newPage: number) => {
    loadAboutMeReviews(newPage);
  };

  if (state.loading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.spinner} />
        <div className={styles.emptyText}>{t("loading")}</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={styles.emptyState}>
        <EmptyIcon />
        <div className={styles.emptyTitle}>{t("errorTitle")}</div>
        <div className={styles.emptyText}>{state.error}</div>
      </div>
    );
  }

  if (!companyName) {
    return (
      <div className={styles.emptyState}>
        <EmptyIcon />
        <div className={styles.emptyTitle}>{t("noCompanyTitle")}</div>
        <div className={styles.emptyText}>{t("noCompanyText")}</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <EmptyIcon />
        <div className={styles.emptyTitle}>{t("emptyAboutMeTitle")}</div>
        <div className={styles.emptyText}>{t("emptyAboutMeText")}</div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

function EmptyIcon() {
  return (
    <svg
      className={styles.emptyIcon}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M52.56 26.64C53.2 26.64 53.7467 26.4267 54.2 26C54.6533 25.5733 54.88 25.0533 54.8733 24.44C54.8667 23.8267 54.64 23.3133 54.1933 22.9C53.7467 22.4867 53.2067 22.2867 52.5733 22.2933H41.3C40.6733 22.2933 40.14 22.4933 39.7 22.9C39.2533 23.3133 39.0267 23.8267 39.0267 24.44C39.0267 25.0533 39.2533 25.5667 39.7 25.98C40.1467 26.3933 40.6733 26.6 41.3 26.64H52.56ZM52.56 38.3533C53.2 38.3533 53.7467 38.14 54.2 37.7133C54.6533 37.2867 54.88 36.7667 54.8733 36.1533C54.8667 35.54 54.64 35.0267 54.1933 34.6133C53.7467 34.2 53.2067 33.9933 52.5733 34H41.3C40.6733 34 40.14 34.2 39.7 34.6C39.2533 35.0067 39.0267 35.5133 39.0267 36.12C39.0267 36.7267 39.2533 37.2333 39.7 37.64C40.1467 38.0467 40.6733 38.2533 41.3 38.3533H52.56ZM21.6267 42.0267C19.6333 42.0267 17.92 42.1667 16.5067 42.4467C15.0933 42.7267 13.8533 43.18 12.7867 43.8133C11.8267 44.3333 11.0933 44.9 10.5867 45.5133C10.08 46.1267 9.83333 46.78 9.84 47.4733C9.84 47.9267 10.0467 48.3267 10.46 48.6733C10.8733 49.02 11.3867 49.1933 12 49.1933H31.2533C31.8667 49.1933 32.4067 49.0 32.8733 48.6133C33.34 48.2267 33.5733 47.74 33.5733 47.1533C33.5733 46.5267 33.3467 45.9267 32.8933 45.3533C32.44 44.78 31.7133 44.2 30.7133 43.6133C29.6 42.98 28.3533 42.5267 26.9733 42.2533C25.5933 41.98 23.7867 41.84 21.5533 42.0267H21.6267ZM21.6267 36.0733C23.1533 36.0733 24.4333 35.5467 25.4667 34.4933C26.5067 33.4333 27.0267 32.12 27.0267 30.5533C27.0267 28.9867 26.5067 27.68 25.4667 26.6333C24.4267 25.5867 23.14 25.06 21.6067 25.0533C20.0733 25.0467 18.7867 25.5733 17.7467 26.6333C16.7067 27.6933 16.1867 29 16.1867 30.5533C16.1867 32.1067 16.7067 33.4133 17.7467 34.4733C18.7867 35.5333 20.0733 36.0667 21.6067 36.0733H21.6267ZM5.62 58.6667C4.00667 58.6667 2.64667 58.1 1.58667 56.9667C0.526667 55.8333 0 54.46 0 52.8467V10.78C0 9.14 0.526667 7.77333 1.58 6.68C2.63333 5.58667 3.98 5.04 5.62 5.04H59.3867C60.9933 5.04 62.34 5.58667 63.4267 6.68C64.5133 7.77333 65.06 9.14 65.0667 10.78V52.8533C65.0667 54.4667 64.52 55.84 63.4267 56.9733C62.3333 58.1067 60.9867 58.6667 59.3867 58.6667H5.62ZM5.62 55.14H59.3867C60.0267 55.14 60.5867 54.9 61.0667 54.42C61.5467 53.94 61.7867 53.3733 61.7867 52.72V10.6533C61.7867 9.99333 61.5467 9.42667 61.0667 8.95333C60.5867 8.48 60.0267 8.24667 59.3867 8.25333H5.62C4.98 8.25333 4.42 8.48667 3.94 8.95333C3.46 9.42 3.22 9.98667 3.22 10.6533V52.72C3.22 53.38 3.46 53.9467 3.94 54.42C4.42 54.8933 4.98 55.1333 5.62 55.14Z"
        fill="currentColor"
      />
    </svg>
  );
}
