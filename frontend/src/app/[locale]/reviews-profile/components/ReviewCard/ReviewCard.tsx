"use client";

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import styles from "./ReviewCard.module.scss";
import type { ReviewItem } from "../../store";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const t = useTranslations('Reviews');
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const renderStars = (rating: number | null) => {
    const ratingValue = rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => {
      const starIndex = i + 1;
      return (
        <span key={i} className={ratingValue >= starIndex ? styles.starFilled : styles.star}>
          {ratingValue >= starIndex ? '★' : '☆'}
        </span>
      );
    });
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewTop}>
        <div className={styles.reviewSource}>{review.source}</div>
        <div className={styles.reviewStarsRow}>
          <div className={styles.reviewStars}>
            {renderStars(review.rating)}
          </div>
          <div className={styles.reviewRatingNumber}>{(review.rating ?? 0).toFixed(1)}</div>
        </div>
      </div>

      <div className={styles.reviewTitleDate}>
        <div className={styles.reviewTitle}>{review.subject}</div>
        <div className={styles.reviewDate}>{formatDate(review.review_date)}</div>
      </div>

      <div className={styles.reviewFromRow}>
        <div className={styles.reviewFromLabel}>{t('fromLabel')}</div>
        <div className={styles.reviewAuthor}>
          {review.reviewer_id ? (
            <a 
              href={`/${locale}/reviews/item/${review.reviewer_id}`} 
              className={styles.reviewAuthorLink}
            >
              {review.reviewer}
            </a>
          ) : (
            review.reviewer
          )}
        </div>
      </div>

      <div className={styles.reviewBubble}>{review.comment}</div>
    </div>
  );
}
