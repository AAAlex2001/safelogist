"use client";

import React from "react";
import styles from "./Bot.module.scss";
import { Typography } from "@/components/Typography";
import { CheckIconTG, SafeLogistBotQrCard } from "@/icons";

export default function Bot() {
  return (
    <section className={styles.bot}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Проверяйте компании прямо в Telegram"
        />

        <Typography
          as="h2"
          size={18}
          desktopSize={18}
          text={"Откройте веб-приложение SafeLogist\nв один клик — без лишних шагов"}
          brown={true}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.list}>
          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <span className={styles.listText}>Проверка компании</span>
          </div>
          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <span className={styles.listText}>Финансовый отчет</span>
          </div>
          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <span className={styles.listText}>Отзывы и рейтинг</span>
          </div>
          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <span className={styles.listText}>Проверка гос. данных</span>
          </div>
        </div>

        <div className={styles.qrWrap}>
          <SafeLogistBotQrCard className={styles.qr} size={200} />
            <div className={styles.handle}>@safelogist_bot</div>
        </div>
      </div>
    </section>
  );
}
