import React from "react";
import { Typography } from "@/components/Typography";
import styles from "./Steps.module.scss";
import { SearchBar} from "@/components/SearchBar";

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
      <div className={styles.stepsContainer}>
        <div className={styles.step}>
            <Typography
                as="h3"
                size={20}
                desktopSize={20}
                blue={true}
                text="Шаг 1 из 3."
            />
            <Typography
                as="h1"
                size={20}
                desktopSize={20}
                blue={true}
                text="Введите регистрационный/налоговый номер"
            />
            <Typography
                as="h2"
                size={18}
                desktopSize={18}
                text="Укажите интересующую организацию — мы начнём поиск по официальным источникам"
            />
        </div>
      </div>
    </section>
  );
}

export default Steps;
