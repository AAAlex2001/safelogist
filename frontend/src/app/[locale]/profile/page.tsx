"use client";

import { useTranslations } from "next-intl";
import styles from "./profile.module.scss";
import { PersonalTab } from "./components/PersonalTab/PersonalTab";
import { SecurityTab } from "./components/SecurityTab/SecurityTab";
import Footer from "@/components/footer/Footer";
import { ProfileProvider, useProfile } from "./store";
import { SuccessNotification } from "@/components/notifications/SuccessNotification";
import { ErrorNotification } from "@/components/notifications/ErrorNotification";
import { Tabs } from "@/components/tabs";

function ProfileContent() {
  const t = useTranslations("Profile");
  const {
    state,
    hasChanges,
    saveProfile,
    changePassword,
    setTab,
    setSuccess,
    setError,
  } = useProfile();

  const handleSave = async () => {
    if (state.activeTab === "personal") {
      await saveProfile();
    } else {
      await changePassword();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.title}>{t("pageTitle")}</div>
          <div className={styles.subtitle}>
            {t("pageSubtitle")}
          </div>
        </header>

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.saveBtn}`}
            type="button"
            onClick={handleSave}
            disabled={state.saving || state.loading}
          >
            {state.saving ? (
              <span className={styles.btnSpinner} />
            ) : (
              <>
                <SaveIcon />
                {t("saveButton")}
                {hasChanges && state.activeTab === "personal" && (
                  <span className={styles.unsavedDot} />
                )}
              </>
            )}
          </button>
        </div>

        <Tabs
          tabs={[
            { id: "personal", label: t("personalDataTab") },
            { id: "security", label: t("securityTab") },
          ]}
          activeTab={state.activeTab}
          onTabChange={(tab) => setTab(tab as "personal" | "security")}
        />

        {state.activeTab === "personal" && <PersonalTab />}
        {state.activeTab === "security" && <SecurityTab />}
      </div>
      <Footer />

      {state.success && (
        <SuccessNotification
          message={state.success}
          onClose={() => setSuccess(null)}
        />
      )}
      {state.error && (
        <ErrorNotification
          message={state.error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
}

function SaveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3V8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V15H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
