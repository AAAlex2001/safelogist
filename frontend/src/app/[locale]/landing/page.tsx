import React from "react";
import { Hero } from "./hero";
import styles from "./landing.module.scss";
import Footer from "@/components/footer/Footer";
import { Functions } from "./functions/Functions";
import { Steps } from "./steps/Steps";
import Reviews from "./reviews/Reviews";
import Bot from "./bot/Bot";
import { Tariffs } from "./tariffs";
import { FAQ } from "./faq";
import { ReviewCta } from "./reviewCta";

export default function LandingPage() {
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
