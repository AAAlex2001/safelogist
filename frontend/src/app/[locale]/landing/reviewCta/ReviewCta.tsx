"use client";

import styles from "./ReviewCta.module.scss";
import { Link } from "@/i18n/navigation";
import { ArrowRightCtaIcon } from "@/icons";
import type { ReviewCtaContent } from "@/types/landing";

type Props = {
  content: ReviewCtaContent;
};

export function ReviewCta({ content }: Props) {
  const data = content;

  return (
    <section className={styles.reviewCta}>
      <Link href={data.link_url} className={styles.ctaLink}>
        <span className={styles.text}>
          {data.text} {data.highlight && <strong>{data.highlight}</strong>}
        </span>
        <ArrowRightCtaIcon className={styles.arrow} />
      </Link>
    </section>
  );
}
