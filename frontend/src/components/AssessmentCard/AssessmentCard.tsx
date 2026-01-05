import React from "react";
import styles from "./AssessmentCard.module.scss";
import TruckIcon from "@/icons/TruckIcon";
import StarIcon from "@/icons/StarIcon";

export function AssessmentCard() {
  return (
    <div className={styles.card}>
      <div className={styles.contractorCard}>
        <div className={styles.contractorHeader}>
          <div className={styles.userBadge}>
            <TruckIcon />
          </div>
          <div className={styles.contractorInfo}>
            <div className={styles.contractorName}>ТрансЛогистик, ООО</div>
            <div className={styles.contractorTagline}>Надёжный партнёр в грузоперевозках</div>
          </div>
        </div>

        <div className={styles.reviewsRow}>24 отзыва о подрядчике</div>

        <div className={styles.ratingRow}>
          <div className={styles.ratingLabel}>Рейтинг</div>
          <div className={styles.stars} aria-hidden="true">
            <StarIcon filled />
            <StarIcon filled />
            <StarIcon filled />
            <StarIcon filled />
            <StarIcon filled />
          </div>
          <div className={styles.ratingNumber}>5,0</div>
        </div>
      </div>

      <div className={styles.contractorCardSmall}>
        <div className={styles.contractorHeader}>
          <div className={styles.userBadge}>
            <TruckIcon />
          </div>
          <div className={styles.contractorInfo}>
            <div className={styles.contractorName}>ТрансЛогистик, ООО</div>
            <div className={styles.contractorTagline}>Надёжный партнёр в грузоперевозках</div>
          </div>
        </div>

        <div className={styles.reviewsRow}>57 отзывов о подрядчике</div>
      </div>
    </div>
  );
}

export default AssessmentCard;
