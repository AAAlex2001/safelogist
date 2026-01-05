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

  const pillPositionClass = 
    activeStep === 1 ? styles.pillPos1 : 
    activeStep === 2 ? styles.pillPos2 : 
    styles.pillPos3;

  return (
    <div className={styles.root} aria-label="Переключатель шагов">
      <button
        type="button"
        className={`${styles.pill} ${pillPositionClass}`}
        aria-current="step"
      >
        <span className={styles.pillText}>{stepLabel[activeStep]}</span>
        <span className={styles.pillIcon} aria-hidden="true">
          <Icon />
        </span>
      </button>

      {activeStep !== 1 && (
        <button
          type="button"
          className={`${styles.stepText} ${styles.step1}`}
          onClick={() => onChange(1)}
        >
          Шаг 1
        </button>
      )}
      {activeStep !== 2 && (
        <button
          type="button"
          className={`${styles.stepText} ${styles.step2}`}
          onClick={() => onChange(2)}
        >
          Шаг 2
        </button>
      )}
      {activeStep !== 3 && (
        <button
          type="button"
          className={`${styles.stepText} ${styles.step3}`}
          onClick={() => onChange(3)}
        >
          Шаг 3
        </button>
      )}
    </div>
  );
}

export default DesktopStepsSwitcher;
