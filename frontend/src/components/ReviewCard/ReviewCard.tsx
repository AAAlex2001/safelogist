import React from "react";
import styles from "./ReviewCard.module.scss";
import TruckIcon from "@/icons/TruckIcon";
import StarIcon from "@/icons/StarIcon";
import LogoSmall from "@/icons/logoSmall";

type ReviewCardProps = {
  authorName?: string;
  authorRole?: string;
  authorCompany?: string | null;
  authorAvatar?: string | null;
  text?: string;
  rating?: number;
  ratingLabel?: string;
  fromLabel?: string;
};

export function ReviewCard({ 
  authorName,
  authorRole, 
  authorCompany,
  authorAvatar,
  text,
  rating,
  ratingLabel,
  fromLabel
}: ReviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userBadge}>
          {authorAvatar ? (
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL}${authorAvatar}`} 
              alt={authorName || "Avatar"}
              className={styles.avatarImg}
            />
          ) : (
            <TruckIcon />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.label}>{authorRole}</div>
          <div className={styles.contractor}>{authorCompany}</div>
        </div>
      </div>

      <div className={styles.reviewBody}>
        <div className={styles.reviewText}>
          {text}
        </div>
      </div>

      {rating && (
        <div className={styles.ratingRow}>
          <div className={styles.ratingLabel}>{ratingLabel}</div>
          <div className={styles.stars} aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= Math.round(rating)} />
            ))}
          </div>
          <div className={styles.ratingNumber}>{rating.toFixed(1)}</div>
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.from}>
          <div className={styles.fromLabel}>{fromLabel}</div>
          <div className={styles.fromName}>{authorName}</div>
        </div>
        <div className={styles.badge} aria-hidden="true">
          <LogoSmall />
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
