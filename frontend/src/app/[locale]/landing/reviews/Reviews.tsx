import React from "react";
import styles from "./Reviews.module.scss";
import { Typography } from "@/components/Typography";

export default function Reviews() {
  return (
    <section className={styles.reviews}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Реальные отзывы о компаниях на платформе"
        />
        <Typography
          as="h2"
          size={18}
          desktopSize={18}
          text="Узнайте, как компании ведут себя на деле — по опыту других"
          brown={true}
        />
      </div>
    </section>
  );
}
