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

        <h2 className={styles.subtitle}>
          Откройте веб-приложение{" "}
          <a
            href="https://t.me/safelogist_bot"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.subtitleLink}
          >
            SafeLogist
          </a>
          {" "}в один клик — без лишних шагов
        </h2>
      </div>

      <div className={styles.card}>
        <div className={styles.list}>
          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <div className={styles.listText}>
              <Typography as="h3" size={18} desktopSize={18} blue={true} white={true} weight="normal" text="Веб-приложение внутри Telegram" />
              <Typography as="h4" size={16} desktopSize={16} white={true} weight="normal" text="Полный доступ к SafeLogist без браузера" />
            </div>
          </div>

          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <div className={styles.listText}>
              <Typography as="h3" size={18} desktopSize={18} blue={true} white={true} weight="normal" text="Быстрый поиск компании" />
              <Typography as="h4" size={16} desktopSize={16} white={true} weight="normal" text="Введите регистрационный или налоговый номер" />
            </div>
          </div>

          <div className={styles.listItem}>
            <span className={styles.listIcon}>
              <CheckIconTG size={24} />
            </span>
            <div className={styles.listText}>
              <Typography as="h3" size={18} desktopSize={18} blue={true} white={true} weight="normal" text="Удобно на телефоне" />
              <Typography as="h4" size={16} desktopSize={16} white={true} weight="normal" text="Проверяйте компании в дороге и на встречах" />
            </div>
          </div>
        </div>

        <div className={styles.qrWrap}>
          <SafeLogistBotQrCard className={styles.qr} size={200} />
          <a
            href="https://t.me/safelogist_bot"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.handle}
          >
            @safelogist_bot
          </a>
        </div>
      </div>
    </section>
  );
}
