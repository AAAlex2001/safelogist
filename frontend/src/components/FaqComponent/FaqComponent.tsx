"use client";

import { useId, useState } from "react";
import styles from "./FaqComponent.module.scss";
import { PlusIcon } from "@/icons";

interface FaqComponentProps {
  question: string;
  answer?: string;
  defaultOpen?: boolean;
  className?: string;
}

export function FaqComponent({
  question,
  answer,
  defaultOpen = false,
  className,
}: FaqComponentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const hasAnswer = Boolean(answer && answer.trim().length > 0);

  return (
    <div
      className={[
        styles.accordion,
        isOpen ? styles.isOpen : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className={styles.questionRow}
        onClick={() => hasAnswer && setIsOpen((v) => !v)}
        aria-expanded={hasAnswer ? isOpen : false}
        aria-controls={hasAnswer ? contentId : undefined}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={styles.iconWrap} aria-hidden="true">
          <PlusIcon className={styles.icon} />
        </span>
      </button>

      {hasAnswer && (
        <div
          id={contentId}
          className={styles.answerWrap}
          aria-hidden={!isOpen}
        >
          <div className={styles.answerInner}>
            <div 
              className={styles.answerText}
              dangerouslySetInnerHTML={{ __html: answer! }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
