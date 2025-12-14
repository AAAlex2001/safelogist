"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./profile.module.scss";
import { PersonalTab } from "./components/PersonalTab/PersonalTab";
import { SecurityTab } from "./components/SecurityTab/SecurityTab";

type Tab = "personal" | "security";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

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
          >
            <SaveIcon />
            Сохранить
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "personal" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Личные данные
          </button>
          <button
            className={`${styles.tab} ${activeTab === "security" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Безопасность
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "personal" && <PersonalTab />}
        {activeTab === "security" && <SecurityTab />}
      </div>
    </div>
  );
}

/* Icons */
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
