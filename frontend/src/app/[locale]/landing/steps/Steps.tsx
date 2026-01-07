"use client";

import { useState } from "react";
import Image from "next/image";
import { Typography } from "@/components/Typography";
import styles from "./Steps.module.scss";
import { SearchBar } from "@/components/SearchBar";
import { AssessmentCard } from "@/components/AssessmentCard";
import { ReviewCard } from "@/components/ReviewCard";
import { DesktopStepsSwitcher } from "@/components/DesktopStepsSwitcher";
import type { StepsContent } from "@/types/landing";

type Step = 1 | 2 | 3;

type Props = {
  content: StepsContent;
};

export function Steps({ content }: Props) {
  const [activeStep, setActiveStep] = useState<Step>(1);
  const data = content;

  return (
    <section className={styles.steps}>
      <div className={styles.headings}>
        <Typography as="h1" size={24} desktopSize={24} blue={true} text={data.title} />
        <Typography as="h2" size={18} desktopSize={18} text={data.subtitle} brown={true} />
      </div>
      <div className={styles.stepsWrapper} data-active-step={activeStep}>
        <DesktopStepsSwitcher activeStep={activeStep} onChange={setActiveStep} />

        <div className={styles.stepsContent}>
          <div className={`${styles.step} ${activeStep === 1 ? styles.active : ""}`} data-step={1}>
            <Typography
              as="h3"
              size={20}
              desktopSize={20}
              blue={true}
              weight="normal"
              text={data.steps[0].counter}
              className={styles.stepCounter}
            />
            <Typography as="h1" size={20} desktopSize={20} blue={true} text={data.steps[0].title} />
            <Typography as="h2" size={18} desktopSize={18} text={data.steps[0].text} />
            <SearchBar disabled={true} />
          </div>

          <div className={`${styles.step} ${activeStep === 2 ? styles.active : ""}`} data-step={2}>
            <Typography
              as="h3"
              size={20}
              desktopSize={20}
              blue={true}
              weight="normal"
              text={data.steps[1].counter}
              className={styles.stepCounter}
            />
            <Typography as="h1" size={20} desktopSize={20} blue={true} text={data.steps[1].title} />
            <Typography as="h2" size={18} desktopSize={18} text={data.steps[1].text} />
            <div className={styles.stepImage}>
              {data.step2_image ? (
                <Image src={data.step2_image} alt="Step 2" width={340} height={200} />
              ) : (
                <Image src="/step.png" alt="Step 2" width={340} height={200} />
              )}
            </div>
          </div>

          <div className={`${styles.step} ${activeStep === 3 ? styles.active : ""}`} data-step={3}>
            <Typography
              as="h3"
              size={20}
              desktopSize={20}
              blue={true}
              weight="normal"
              text={data.steps[2].counter}
              className={styles.stepCounter}
            />
            <Typography as="h1" size={20} desktopSize={20} blue={true} text={data.steps[2].title} />
            <Typography as="h2" size={18} desktopSize={18} text={data.steps[2].text} />
            <div className={styles.cards}>
              {data.cards && data.cards.map((card) => (
                card.card_type === 'review' ? (
                  <ReviewCard 
                    key={card.id}
                    authorName={card.author_name || card.title}
                    authorRole={card.author_role || "Подрядчик"}
                    authorCompany={card.author_company || card.description}
                    text={card.review_text || card.description}
                  />
                ) : (
                  <AssessmentCard 
                    key={card.id} 
                    title={card.title}
                    description={card.description}
                    reviewsCount={card.reviews_count}
                    reviewsText={card.reviews_text}
                    rating={card.rating}
                    ratingLabel={card.rating_label}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Steps;
