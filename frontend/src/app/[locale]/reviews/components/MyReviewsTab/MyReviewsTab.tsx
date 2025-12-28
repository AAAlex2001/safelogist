"use client";

import { useTranslations } from "next-intl";
import styles from "../../reviews.module.scss";

export function MyReviewsTab() {
  const t = useTranslations("Reviews");

  // TODO: Fetch user's reviews data here
  const reviews: never[] = [];

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <EmptyIcon />
        <div className={styles.emptyTitle}>{t("emptyMyReviewsTitle")}</div>
        <div className={styles.emptyText}>{t("emptyMyReviewsText")}</div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      {/* TODO: Render review cards here */}
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
        d="M8 56V12C8 10.8954 8.89543 10 10 10H54C55.1046 10 56 10.8954 56 12V44C56 45.1046 55.1046 46 54 46H16L8 56Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 22H44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 30H36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
