"use client";

import { useTranslations } from "next-intl";
import styles from "../../reviews.module.scss";

export function MyReviewsTab() {
  const t = useTranslations("Reviews");

  const reviews: never[] = [];

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
    </div>
  );
}
