"use client";

import styles from "./Reviews.module.scss";
import { Typography } from "@/components/Typography";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ArrowSwiper from "@/icons/Arrow";
import type { ReviewsContent } from "@/types/landing";

type Props = {
  content: ReviewsContent;
};

export default function Reviews({ content }: Props) {
  const data = content;

  return (
    <section className={styles.reviews}>
      <div className={styles.headings}>
        <Typography as="h1" size={24} desktopSize={24} blue={true} text={data.title} />
        <Typography as="h2" size={18} desktopSize={18} text={data.subtitle} brown={true} />
      </div>

      <div className={styles.swiperWrap}>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.${styles.btnPrev}`,
            nextEl: `.${styles.btnNext}`,
          }}
          spaceBetween={24}
          slidesPerView="auto"
          className={styles.swiper}
          loop={true}
        >
          {[...Array(15)].map((_, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              <ReviewCard />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.slideBtns}>
          <button type="button" className={styles.btnPrev} aria-label="Back">
            <ArrowSwiper className={styles.arrow} />
          </button>
          <button type="button" className={styles.btnNext} aria-label="Forward">
            <ArrowSwiper className={styles.arrow} />
          </button>
        </div>
      </div>
    </section>
  );
}
