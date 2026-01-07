"use client";

import styles from "./FAQ.module.scss";
import { Typography } from "@/components/Typography";
import { FaqComponent } from "@/components/FaqComponent";
import type { FaqContent } from "@/types/landing";

type Props = {
  content: FaqContent;
};

export function FAQ({ content }: Props) {
  const data = content;

  return (
    <section className={styles.faqFullBleed}>
      <div className={styles.faq}>
        <div className={styles.headings}>
          <Typography as="h1" size={24} desktopSize={24} blue={true} text={data.title} />
        </div>

        <div className={styles.items}>
          {data.items.map((item, index) => (
            <FaqComponent key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
