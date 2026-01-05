import React from "react";
import styles from "./ReviewCard.module.scss";
import TruckIcon from "@/icons/TruckIcon";
import LogoSmall from "@/icons/logoSmall";

export function ReviewCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userBadge}>
          <TruckIcon />
        </div>

        <div className={styles.info}>
          <div className={styles.label}>Подрядчик</div>
          <div className={styles.contractor}>просто логистика (лима, ООО)</div>
        </div>
      </div>

      <div className={styles.reviewBody}>
        <div className={styles.reviewText}>
          «Добросовестная организация, всегда на связи, оплата в срок и в полном объёме, приятно сотрудничать, рекомендуем!» И спасибо Марии за качественную работу.
          Будем рады дальнейшему сотрудничеству!
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.from}>
          <div className={styles.fromLabel}>От:</div>
          <div className={styles.fromName}>Перевалова Татьяна Николаевна, ИП</div>
        </div>
        <div className={styles.badge} aria-hidden="true">
          <LogoSmall />
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
