import React from "react";
import styles from "./ReviewCard.module.scss";
import TruckIcon from "@/icons/TruckIcon";
import LogoSmall from "@/icons/logoSmall";

type ReviewCardProps = {
  authorName: string;
  authorRole: string;
  authorCompany?: string | null;
  text: string;
  rating?: number;
};

export function ReviewCard({ 
  authorName,
  authorRole, 
  authorCompany,
  text,
  rating = 5
}: ReviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userBadge}>
          <TruckIcon />
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

      <div className={styles.footer}>
        <div className={styles.from}>
          <div className={styles.fromLabel}>От:</div>
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
