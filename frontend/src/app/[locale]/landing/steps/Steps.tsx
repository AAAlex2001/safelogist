import React from "react";
import { Typography } from "@/components/Typography";
import styles from "./Steps.module.scss";

export function Steps() {
  return (
    <section className={styles.steps}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Мы поможем защитить ваш бизнес в 3 шага"
        />
        <Typography
          as="h2"
          size={18}
          desktopSize={18}
          text="Минимизируйте риски для вашего бизнеса: мы предоставляем полную информацию, вы принимаете взвешенное решение"
          brown={true}
        />
      </div>
    </section>
  );
}

export default Steps;
