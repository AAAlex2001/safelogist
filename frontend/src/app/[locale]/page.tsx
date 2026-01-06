import React from "react";
import { Hero } from "./landing/hero";
import styles from "./landing/landing.module.scss";
import Footer from "@/components/footer/Footer";
import { Functions } from "./landing/functions/Functions";
import { Steps } from "./landing/steps/Steps";
import Reviews from "./landing/reviews/Reviews";
import Bot from "./landing/bot/Bot";
import { Tariffs } from "./landing/tariffs";
import { FAQ } from "./landing/faq";
import { ReviewCta } from "./landing/reviewCta";

export default function Page() {
  return (
    <div className={styles.landingWrap}>
      <main className={styles.landing}>
        <Hero />
        <ReviewCta />
        <Functions />
        <Steps />
        <Reviews />
        <Bot />
        <Tariffs />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
