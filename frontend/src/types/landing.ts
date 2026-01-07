export type HeroContent = {
  locale: string;
  title: string;
  title_highlight?: string | null;
  subtitle: string;
  stat_companies_label: string;
  stat_companies_value: number;
  stat_companies_suffix?: string | null;
  stat_reviews_label: string;
  stat_reviews_value: number;
  stat_reviews_suffix?: string | null;
  stat_countries_label: string;
  stat_countries_value: number;
  stat_countries_suffix?: string | null;
  stat_sources_label: string;
  stat_sources_value: number;
  stat_sources_suffix?: string | null;
};

export type ReviewCtaContent = {
  locale: string;
  text: string;
  highlight?: string | null;
  link_url: string;
};

export type FunctionsItem = {
  title: string;
  text: string;
};

export type FunctionsContent = {
  locale: string;
  title: string;
  subtitle: string;
  tab1_label: string;
  tab2_label: string;
  tab1_items: FunctionsItem[];
  tab2_items: FunctionsItem[];
};

export type StepItem = {
  counter: string;
  title: string;
  text: string;
  image?: string | null;
};

export type StepsCard = {
  id: number;
  title: string;
  description: string;
  icon?: string | null;  reviews_count?: number;
  reviews_text?: string;
  rating?: number;  rating_label?: string;
  order: number;
};

export type StepsContent = {
  locale: string;
  title: string;
  subtitle: string;
  steps: StepItem[];
  step2_image?: string | null;
  cards: StepsCard[];
};

export type ReviewItem = {
  id: number;
  author_name: string;
  author_role: string;
  author_company?: string | null;
  author_avatar?: string | null;
  rating: number;
  text: string;
  order: number;
};

export type ReviewsContent = {
  locale: string;
  title: string;
  subtitle: string;
  items: ReviewItem[];
};

export type BotItem = {
  title: string;
  text: string;
};

export type BotContent = {
  locale: string;
  title: string;
  subtitle_text: string;
  subtitle_link_text: string;
  subtitle_link_url: string;
  subtitle_after_link?: string | null;
  items: BotItem[];
  bot_handle: string;
  bot_url: string;
};

export type TariffCard = {
  badge: string;
  title: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  cta: string;
  popular: boolean;
};

export type TariffsContent = {
  locale: string;
  title: string;
  subtitle: string;
  cards: TariffCard[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  locale: string;
  title: string;
  items: FaqItem[];
};

export type LandingContent = {
  hero: HeroContent | null;
  review_cta: ReviewCtaContent | null;
  functions: FunctionsContent | null;
  steps: StepsContent | null;
  reviews: ReviewsContent | null;
  bot: BotContent | null;
  tariffs: TariffsContent | null;
  faq: FaqContent | null;
};
