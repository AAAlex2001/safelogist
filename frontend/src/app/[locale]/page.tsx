import React from "react";
import { Hero, HeroContent } from "./landing/hero";
import styles from "./landing/landing.module.scss";
import Footer from "@/components/footer/Footer";
import { Functions } from "./landing/functions/Functions";
import { Steps } from "./landing/steps/Steps";
import Reviews from "./landing/reviews/Reviews";
import Bot from "./landing/bot/Bot";
import { Tariffs } from "./landing/tariffs";
import { FAQ } from "./landing/faq";
import { ReviewCta } from "./landing/reviewCta";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getHeroContent(locale: string): Promise<HeroContent | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/landing/hero?lang=${encodeURIComponent(locale)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch hero content:", e);
  }
  return null;
}

export default async function Page({
  params,
}: {
  params: { locale: string };
}) {
  const heroContent = await getHeroContent(params.locale);

  return (
    <div className={styles.landingWrap}>
      <main className={styles.landing}>
        {heroContent && <Hero content={heroContent} />}
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
