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
import type { Metadata } from "next";
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

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  ru: {
    title: "SafeLogist — Проверенная информация о логистических компаниях",
    description: "Сервис проверки и анализа транспортных и логистических компаний. Отзывы, судебные дела и оценка рисков сотрудничества на основе данных из официальных источников — SafeLogist.",
  },
  en: {
    title: "SafeLogist — Verified Information About Logistics Companies",
    description: "Service for checking and analyzing transport and logistics companies. Reviews, court cases, and cooperation risk assessment based on data from official sources — SafeLogist.",
  },
  uk: {
    title: "SafeLogist — Перевірена інформація про логістичні компанії",
    description: "Сервіс перевірки та аналізу транспортних і логістичних компаній. Відгуки, судові справи та оцінка ризиків співпраці на основі даних з офіційних джерел — SafeLogist.",
  },
  ro: {
    title: "SafeLogist — Informații verificate despre companiile de logistică",
    description: "Serviciu de verificare și analiză a companiilor de transport și logistică. Recenzii, cazuri judiciare și evaluarea riscurilor de cooperare pe baza datelor din surse oficiale — SafeLogist.",
  },
};

async function fetchSection<T>(endpoint: string, locale: string): Promise<T | null> {
  try {
    const url = `${API_URL}/api/landing/${endpoint}?lang=${encodeURIComponent(locale)}`;
    const res = await fetch(url, { 
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = META_BY_LOCALE[locale] || META_BY_LOCALE.ru;
  
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://safelogist.com/${locale}`,
      languages: {
        'ru': 'https://safelogist.com/ru',
        'en': 'https://safelogist.com/en',
        'uk': 'https://safelogist.com/uk',
        'ro': 'https://safelogist.com/ro',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://safelogist.com/${locale}`,
      siteName: 'SafeLogist',
      locale: locale,
      type: 'website',
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getLandingContent(locale);
  
  const faqJsonLd = content.faq ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  const reviewsJsonLd = content.reviews?.items?.length ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'SafeLogist',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (content.reviews.items.reduce((sum, item) => sum + item.rating, 0) / content.reviews.items.length).toFixed(1),
      reviewCount: content.reviews.items.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: content.reviews.items.map((item) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: item.author_name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: item.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: item.text,
      publisher: {
        '@type': 'Organization',
        name: item.author_company || 'Unknown',
      },
    })),
  } : null;

  return (
    <div className={styles.landingWrap}>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {reviewsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
        />
      )}
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
