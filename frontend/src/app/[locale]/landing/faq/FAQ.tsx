"use client";

import React from "react";
import styles from "./FAQ.module.scss";
import { Typography } from "@/components/Typography";

export function FAQ() {
  return (
    <section className={styles.faq}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Часто задаваемые вопросы"
        />
      </div>
    </section>
  );
}
