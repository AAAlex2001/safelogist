"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useReviews } from "../../store";
import { ReviewCard } from "../ReviewCard/ReviewCard";
import styles from "../../reviews.module.scss";

export function MyReviewsTab() {
  const t = useTranslations("Reviews");
  const { state, loadMyReviews } = useReviews();

  useEffect(() => {
    loadMyReviews();
  }, [loadMyReviews]);

  const reviews = state.myReviews.reviews;

  if (state.loading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.spinner} />
        <div className={styles.emptyText}>{t("loading")}</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyTitle}>{t("emptyMyReviewsTitle")}</div>
        <div className={styles.emptyText}>{t("emptyMyReviewsText")}</div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} showStatus />
        ))}
      </div>
    </div>
  );
}
