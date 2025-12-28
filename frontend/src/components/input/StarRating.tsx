"use client";

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
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 4.5L19.5 11.5L27 12.5L21.5 18L23 25.5L16 21.5L9 25.5L10.5 18L5 12.5L12.5 11.5L16 4.5Z"
                fill={index < value ? "#FFD700" : "#D9D9D9"}
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
