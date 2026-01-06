"use client";

import React from "react";
import styles from "./FAQ.module.scss";
import { Typography } from "@/components/Typography";
import { FaqComponent } from "@/components/FaqComponent";

export function FAQ() {
  return (
    <section className={styles.faqFullBleed}>
      <div className={styles.faq}>
        <div className={styles.headings}>
          <Typography
            as="h1"
            size={24}
            desktopSize={24}
            blue={true}
            text="Часто задаваемые вопросы"
          />
        </div>

        <div className={styles.items}>
          <FaqComponent
            question="Безопасны ли мои данные при использовании сервиса?"
            answer="Да. Мы используем защищённое соединение и не передаём ваши данные третьим лицам без необходимости."
          />

          <FaqComponent
            question="Сколько времени занимает проверка компании?"
            answer="Обычно результат доступен в течение минуты — зависит от доступности источников и объёма данных."
          />
        </div>
      </div>
    </section>
  );
}
