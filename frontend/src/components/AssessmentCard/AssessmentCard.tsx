import React from "react";
import styles from "./AssessmentCard.module.scss";
import TruckIcon from "@/icons/TruckIcon";
import StarIcon from "@/icons/StarIcon";

type AssessmentCardProps = {
  title: string;
  description: string;
  reviewsCount?: number;
  rating?: number;
};

export function AssessmentCard({ title, description, reviewsCount = 24, rating = 5.0 }: AssessmentCardProps) {
  const displayRating = rating ?? 5.0;
  
  return (
    <div className={styles.card}>
      <div className={styles.contractorCard}>
        <div className={styles.contractorHeader}>
          <div className={styles.userBadge}>
            <TruckIcon />
          </div>
          <div className={styles.contractorInfo}>
            <div className={styles.contractorName}>{title}</div>
            <div className={styles.contractorTagline}>{description}</div>
          </div>
        </div>

        <div className={styles.reviewsRow}>{reviewsCount} отзыва о подрядчике</div>

        <div className={styles.ratingRow}>
          <div className={styles.ratingLabel}>Рейтинг</div>
          <div className={styles.stars} aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= Math.round(displayRating)} />
            ))}
          </div>
          <div className={styles.ratingNumber}>{displayRating.toFixed(1)}</div>
        </div>
      </div>

      <div className={styles.contractorCardSmall}>
        <div className={styles.contractorHeader}>
          <div className={styles.userBadge}>
            <TruckIcon />
          </div>
          <div className={styles.contractorInfo}>
            <div className={styles.contractorName}>{title}</div>
            <div className={styles.contractorTagline}>{description}</div>
          </div>
        </div>

        <div className={styles.reviewsRow}>{reviewsCount} отзывов о подрядчике</div>
      </div>
    </div>
  );
}

export default AssessmentCard;
