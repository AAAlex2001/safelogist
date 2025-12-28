"use client";

import { useTranslations } from "next-intl";
import styles from "./reviews.module.scss";
import { Tabs } from "@/components/tabs";
import Footer from "@/components/footer/Footer";
import { AboutMeTab } from "./components/AboutMeTab/AboutMeTab";
import { MyReviewsTab } from "./components/MyReviewsTab/MyReviewsTab";
import { RejectedTab } from "./components/RejectedTab/RejectedTab";
import { ReviewsProvider, useReviews } from "./store";

// ============================================================
// Page Content (uses context)
// ============================================================
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
    
    // Load data for the selected tab
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
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.title}>{t("pageTitle")}</div>
          <div className={styles.subtitle}>{t("pageSubtitle")}</div>
        </header>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={state.activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab content */}
        {state.activeTab === "about" && <AboutMeTab />}
        {state.activeTab === "reviews" && <MyReviewsTab />}
        {state.activeTab === "rejected" && <RejectedTab />}
      </div>
      <Footer />
    </div>
  );
}

// ============================================================
// Page (wraps with Provider)
// ============================================================
export default function ReviewsPage() {
  return (
    <ReviewsProvider>
      <ReviewsContent />
    </ReviewsProvider>
  );
}
