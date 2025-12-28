"use client";

import { useTranslations } from "next-intl";
import styles from "../../reviews.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations("Reviews");

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationButtons}>
        {currentPage > 1 ? (
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <PrevIcon />
          </button>
        ) : (
          <span className={`${styles.paginationButton} ${styles.paginationButtonDisabled}`}>
            <PrevIcon />
          </span>
        )}

        <span className={styles.pageInfo}>
          {t("pageLabel")} {currentPage} / {totalPages}
        </span>

        {currentPage < totalPages ? (
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <NextIcon />
          </button>
        ) : (
          <span className={`${styles.paginationButton} ${styles.paginationButtonDisabled}`}>
            <NextIcon />
          </span>
        )}
      </div>
    </div>
  );
}

function PrevIcon() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.25 0.75L1.25 4.75L5.25 8.75" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.75 0.75L4.75 4.75L0.75 8.75" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
