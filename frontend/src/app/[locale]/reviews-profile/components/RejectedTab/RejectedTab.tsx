"use client";

import { useTranslations } from "next-intl";
import styles from "../../reviews.module.scss";

export function RejectedTab() {
  const t = useTranslations("Reviews");

  const reviews: never[] = [];

  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
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
