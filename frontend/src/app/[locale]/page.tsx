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
import type {
  LandingContent,
  HeroContent,
  ReviewCtaContent,
  FunctionsContent,
  StepsContent,
  ReviewsContent,
  BotContent,
  TariffsContent,
  FaqContent,
} from "@/types/landing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchSection<T>(endpoint: string, locale: string): Promise<T | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/landing/${endpoint}?lang=${encodeURIComponent(locale)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.error(`Failed to fetch ${endpoint}`);
  }
  return null;
}

async function getLandingContent(locale: string): Promise<LandingContent> {
  const [hero, reviewCta, functions, steps, reviews, bot, tariffs, faq] = await Promise.all([
    fetchSection<HeroContent>("hero", locale),
    fetchSection<ReviewCtaContent>("review-cta", locale),
    fetchSection<FunctionsContent>("functions", locale),
    fetchSection<StepsContent>("steps", locale),
    fetchSection<ReviewsContent>("reviews", locale),
    fetchSection<BotContent>("bot", locale),
    fetchSection<TariffsContent>("tariffs", locale),
    fetchSection<FaqContent>("faq", locale),
  ]);

  return {
    hero,
    review_cta: reviewCta,
    functions,
    steps,
    reviews,
    bot,
    tariffs,
    faq,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getLandingContent(locale);

  return (
    <div className={styles.landingWrap}>
      <main className={styles.landing}>
        {content.hero && <Hero content={content.hero} />}
        {content.review_cta && <ReviewCta content={content.review_cta} />}
        {content.functions && <Functions content={content.functions} />}
        {content.steps && <Steps content={content.steps} />}
        {content.reviews && <Reviews content={content.reviews} />}
        {content.bot && <Bot content={content.bot} />}
        {content.tariffs && <Tariffs content={content.tariffs} />}
        {content.faq && <FAQ content={content.faq} />}
        <Footer />
      </main>
    </div>
  );
}
