"use client";

import React from "react";
import styles from "./Reviews.module.scss";
import { Typography } from "@/components/Typography";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Reviews() {
  return (
    <section className={styles.reviews}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Реальные отзывы о компаниях на платформе"
        />
        <Typography
          as="h2"
          size={18}
          desktopSize={18}
          text="Узнайте, как компании ведут себя на деле — по опыту других"
          brown={true}
        />
      </div>

      <div className={styles.swiperWrap}>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.${styles.btnPrev}`,
            nextEl: `.${styles.btnNext}`,
          }}
          spaceBetween={24}
          slidesPerView='auto'
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
          <button type="button" className={styles.btnPrev} aria-label="Назад" />
          <button type="button" className={styles.btnNext} aria-label="Вперёд" />
        </div>
      </div>
    </section>
  );
}
