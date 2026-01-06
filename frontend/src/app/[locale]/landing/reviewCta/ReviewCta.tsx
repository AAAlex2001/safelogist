"use client";

import styles from "./ReviewCta.module.scss";
import { Link } from "@/i18n/navigation";
import ArrowSwiper from "@/icons/Arrow";

export function ReviewCta() {
  return (
    <section className={styles.reviewCta}>
      <Link href="/reviews-profile/add" className={styles.ctaLink}>
        <span className={styles.text}>
          Работали с компанией и есть чем поделиться? <strong>Оставьте отзыв</strong>
        </span>
        <ArrowSwiper className={styles.arrow} />
      </Link>
    </section>
  );
}
