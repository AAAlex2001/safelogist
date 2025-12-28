"use client";

import StarIcon from "@/icons/StarIcon";
import styles from "./starRating.module.scss";

type StarRatingProps = {
  label: string;
  value: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
};

export function StarRating({
  label,
  value,
  onChange,
  disabled = false,
}: StarRatingProps) {
  const handleStarClick = (index: number) => {
    if (!disabled && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={styles.ratingBlock}>
      <label className={styles.label}>{label}</label>
      <div className={styles.stars}>
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            type="button"
            className={styles.star}
            onClick={() => handleStarClick(index)}
            disabled={disabled}
            aria-label={`${index + 1} звезда`}
          >
            <StarIcon size={32} filled={index < value} />
          </button>
        ))}
      </div>
    </div>
  );
}
