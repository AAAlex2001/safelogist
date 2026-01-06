import styles from "./TariffCard.module.scss";
import { Button } from "@/components/button/Button";
import { CheckCircleIcon } from "@/icons";

export interface TariffCardProps {
  popular?: boolean;
  badgeText?: string;
  title: string;
  price: string;
  period: string;
  note?: string;
  features: string[];
  ctaText: string;
  onCtaClick?: () => void;
  active?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function TariffCard({
  popular = false,
  badgeText,
  title,
  price,
  period,
  note,
  features,
  ctaText,
  onCtaClick,
  active = false,
  onMouseEnter,
  onMouseLeave,
}: TariffCardProps) {
  const cardClasses = [
    styles.card,
    popular ? styles.popular : "",
    popular ? "popular" : "",
    active ? styles.active : "",
  ].filter(Boolean).join(" ");

  return (
    <div 
      className={cardClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {badgeText && (
        <span className={styles.badge}>{badgeText}</span>
      )}
      <div className={styles.priceRow}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.priceContent}>
        <span className={styles.price}>{price}</span>
        <span className={styles.period}>{period}</span>
        </div>
      </div>
      {note && <p className={styles.note}>{note}</p>}
      <ul className={styles.features}>
        {features.map((feature, idx) => (
          <li key={idx} className={styles.featureItem}>
            <CheckCircleIcon
              size={20}
              variant={active ? "white" : "normal"}
              className={styles.featureIcon}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onCtaClick}
        variant={active ? "primary" : "tariff"}
        fullWidth
      >
        {ctaText}
      </Button>
    </div>
  );
}
