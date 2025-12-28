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
        <div className={styles.emptyTitle}>{t("errorTitle")}</div>
        <div className={styles.emptyText}>{state.error}</div>
      </div>
    );
  }

  if (!companyName) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyTitle}>{t("noCompanyTitle")}</div>
        <div className={styles.emptyText}>{t("noCompanyText")}</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
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
