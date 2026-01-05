"use client";

import React from "react";
import styles from "./DesktopStepsSwitcher.module.scss";
import { Step1Icon, Step2Icon, Step3Icon } from "@/icons";

type Step = 1 | 2 | 3;

type Props = {
  activeStep: Step;
  onChange: (step: Step) => void;
};

const stepLabel: Record<Step, string> = {
  1: "Шаг 1",
  2: "Шаг 2",
  3: "Шаг 3",
};

export function DesktopStepsSwitcher({ activeStep, onChange }: Props) {
  const Icon = activeStep === 1 ? Step1Icon : activeStep === 2 ? Step2Icon : Step3Icon;

  return (
    <div className={styles.root} aria-label="Переключатель шагов">
      <button
        type="button"
        className={styles.pill}
        onClick={() => onChange(activeStep)}
        aria-current="step"
      >
        <span className={styles.pillText}>{stepLabel[activeStep]}</span>
        <span className={styles.pillIcon} aria-hidden="true">
          <Icon />
        </span>
      </button>

      <button
        type="button"
        className={`${styles.stepText} ${styles.step1} ${activeStep === 1 ? styles.activeText : ""}`}
        onClick={() => onChange(1)}
      >
        Шаг 1
      </button>
      <button
        type="button"
        className={`${styles.stepText} ${styles.step2} ${activeStep === 2 ? styles.activeText : ""}`}
        onClick={() => onChange(2)}
      >
        Шаг 2
      </button>
      <button
        type="button"
        className={`${styles.stepText} ${styles.step3} ${activeStep === 3 ? styles.activeText : ""}`}
        onClick={() => onChange(3)}
      >
        Шаг 3
      </button>
    </div>
  );
}

export default DesktopStepsSwitcher;
