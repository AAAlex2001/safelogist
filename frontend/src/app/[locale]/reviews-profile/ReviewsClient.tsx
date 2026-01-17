"use client";

import { useTranslations } from "next-intl";
import styles from "./reviews.module.scss";
import { Tabs } from "@/components/tabs";
import Footer from "@/components/footer/Footer";
import { AboutMeTab } from "./components/AboutMeTab/AboutMeTab";
import { MyReviewsTab } from "./components/MyReviewsTab/MyReviewsTab";
import { RejectedTab } from "./components/RejectedTab/RejectedTab";
import { ReviewsProvider, useReviews } from "./store";

function ReviewsContent() {
  const t = useTranslations("Reviews");
  const { state, setTab, loadAboutMeReviews, loadMyReviews, loadRejectedReviews } = useReviews();

  const tabs = [
    { id: "about", label: t("aboutMeTab") },
    { id: "reviews", label: t("myReviewsTab") },
    { id: "rejected", label: t("rejectedTab") },
  ];

  const handleTabChange = (tabId: string) => {
    const tab = tabId as "about" | "reviews" | "rejected";
    setTab(tab);

    if (tab === "about") {
      loadAboutMeReviews();
    } else if (tab === "reviews") {
      loadMyReviews();
    } else if (tab === "rejected") {
      loadRejectedReviews();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.title}>{t("pageTitle")}</div>
          <div className={styles.subtitle}>{t("pageSubtitle")}</div>
        </header>

        <Tabs tabs={tabs} activeTab={state.activeTab} onTabChange={handleTabChange} />

        {state.activeTab === "about" && <AboutMeTab />}
        {state.activeTab === "reviews" && <MyReviewsTab />}
        {state.activeTab === "rejected" && <RejectedTab />}
      </div>
      <Footer />
    </div>
  );
}

export default function ReviewsClient() {
  return (
    <ReviewsProvider>
      <ReviewsContent />
    </ReviewsProvider>
  );
}
