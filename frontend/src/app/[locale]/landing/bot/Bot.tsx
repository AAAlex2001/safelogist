"use client";

import React from "react";
import styles from "./Bot.module.scss";
import { Typography } from "@/components/Typography";

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
    </section>
  );
}
