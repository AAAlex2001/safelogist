"use client";

import Link from "next/link";
import styles from "./profile.module.scss";
import { PersonalTab } from "./components/PersonalTab/PersonalTab";
import { SecurityTab } from "./components/SecurityTab/SecurityTab";
import Footer from "@/components/footer/Footer";
import { ProfileProvider, useProfile } from "./store";
import { SuccessNotification } from "@/components/notifications/SuccessNotification";
import { ErrorNotification } from "@/components/notifications/ErrorNotification";

// ============================================================
// Page Content (uses context)
// ============================================================
function ProfileContent() {
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
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.title}>Профиль</div>
          <div className={styles.subtitle}>
            Управляйте своими личными данными
          </div>
        </header>

        {/* Action buttons */}
        <div className={styles.actions}>
          <Link href="/" className={styles.actionBtn}>
            <ArrowLeftIcon />
            Назад
          </Link>
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
                Сохранить
                {hasChanges && state.activeTab === "personal" && (
                  <span className={styles.unsavedDot} />
                )}
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${state.activeTab === "personal" ? styles.tabActive : ""}`}
            onClick={() => setTab("personal")}
          >
            Личные данные
          </button>
          <button
            className={`${styles.tab} ${state.activeTab === "security" ? styles.tabActive : ""}`}
            onClick={() => setTab("security")}
          >
            Безопасность
          </button>
        </div>

        {/* Tab content */}
        {state.activeTab === "personal" && <PersonalTab />}
        {state.activeTab === "security" && <SecurityTab />}
      </div>
      <Footer />

      {/* Notifications */}
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

// ============================================================
// Page (wraps with Provider)
// ============================================================
export default function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
}

// ============================================================
// Icons
// ============================================================
function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
