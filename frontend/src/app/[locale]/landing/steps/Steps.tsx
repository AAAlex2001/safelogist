import React from "react";
import Image from "next/image";
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
        <div className={styles.step}>
            <Typography
                as="h3"
                size={20}
                desktopSize={20}
                blue={true}
                weight={"normal"}
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
            <SearchBar
                disabled={true}
            />
        </div>
        <div className={styles.step}>
            <Typography
                as="h3"
                size={20}
                desktopSize={20}
                blue={true}
                weight={"normal"}
                text="Шаг 2 из 3."
            />
            <Typography
                as="h1"
                size={20}
                desktopSize={20}
                blue={true}
                text="Изучите ключевую информацию об организации"
            />
            <Typography
                as="h2"
                size={18}
                desktopSize={18}
                text="Мы собираем судебные дела, отзывы, финансовые показатели и регистрационные данные в одном досье"
            />
            <div className={styles.stepImage}>
              <Image
                src="/step.png"
                alt="Иллюстрация шага 2"
                width={340}
                height={200}
              />
            </div>
      </div>
    </section>
  );
}

export default Steps;
