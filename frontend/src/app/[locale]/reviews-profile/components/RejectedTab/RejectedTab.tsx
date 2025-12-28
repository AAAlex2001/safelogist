"use client";

import { useTranslations } from "next-intl";
import styles from "../../reviews.module.scss";

export function RejectedTab() {
  const t = useTranslations("Reviews");

  const reviews: never[] = [];

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <EmptyIcon />
        <div className={styles.emptyTitle}>{t("emptyRejectedTitle")}</div>
        <div className={styles.emptyText}>{t("emptyRejectedText")}</div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
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
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M24 24L40 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 24L24 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
