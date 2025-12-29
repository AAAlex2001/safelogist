"use client";

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import StarIcon from '@/icons/StarIcon';
import styles from "./ReviewCard.module.scss";
import type { ReviewItem } from "../../store";

interface ReviewCardProps {
  review: ReviewItem;
  showStatus?: boolean;
}

export function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
  const t = useTranslations('Reviews');
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const renderStars = (rating: number | null) => {
    const ratingValue = rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon key={i} size={20} filled={i < ratingValue} />
    ));
  };

  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "PENDING": return t("statusPending");
      case "APPROVED": return t("statusApproved");
      case "REJECTED": return t("statusRejected");
      default: return "";
    }
  };

  const getStatusClass = (status: string | null | undefined) => {
    switch (status) {
      case "PENDING": return styles.statusPending;
      case "APPROVED": return styles.statusApproved;
      case "REJECTED": return styles.statusRejected;
      default: return "";
    }
  };

  // Определяем режим отображения: мои отзывы или отзывы обо мне
  const isMyReview = !!review.target_company;
  
  // Источник: для моих отзывов показываем "SafeLogist", для отзывов обо мне - source
  const source = isMyReview ? "SafeLogist" : review.source;
  
  // На кого отзыв
  const targetName = isMyReview ? review.target_company : review.subject;
  
  // Дата
  const date = isMyReview ? review.created_at : review.review_date;
  
  // От кого отзыв
  const fromName = isMyReview ? review.from_company : review.reviewer;
  const fromId = isMyReview ? null : review.reviewer_id;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewTop}>
        <div className={styles.reviewSource}>{source}</div>
        <div className={styles.reviewStarsRow}>
          <div className={styles.reviewStars}>
            {renderStars(review.rating)}
          </div>
          <div className={styles.reviewRatingNumber}>{(review.rating ?? 0).toFixed(1)}</div>
        </div>
      </div>

      <div className={styles.reviewTitleDate}>
        <div className={styles.reviewTitle}>{targetName}</div>
        <div className={styles.reviewDate}>{formatDate(date)}</div>
      </div>

      <div className={styles.reviewFromRow}>
        <div className={styles.reviewFromLabel}>{t('fromLabel')}</div>
        <div className={styles.reviewAuthor}>
          {fromId ? (
            <a 
              href={`/${locale}/reviews/item/${fromId}`} 
              className={styles.reviewAuthorLink}
            >
              {fromName}
            </a>
          ) : (
            fromName
          )}
        </div>
      </div>

      <div className={styles.reviewBubble}>{review.comment}</div>

      {showStatus && review.status && (
        <div className={styles.statusRow}>
          <div className={`${styles.statusBadge} ${getStatusClass(review.status)}`}>
            {getStatusLabel(review.status)}
          </div>
        </div>
      )}

      {review.admin_comment && (
        <div className={styles.adminComment}>
          <div className={styles.adminCommentLabel}>{t("adminCommentLabel")}</div>
          <div className={styles.adminCommentText}>{review.admin_comment}</div>
        </div>
      )}
    </div>
  );
}
