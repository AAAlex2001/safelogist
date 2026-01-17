"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Tabs } from "@/components/tabs";
import { Toggle } from "@/components/toggle";
import { InputField } from "@/components/input/InputField";
import { Button } from "@/components/button/Button";
import { useTheme } from "@/context/ThemeContext";
import Footer from "@/components/footer/Footer";
import styles from "./settings.module.scss";

type TabId = "notifications" | "interface";

export default function SettingsClient() {
  const t = useTranslations("Settings");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabId>("notifications");
  const [saving, setSaving] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [monitoringAlerts, setMonitoringAlerts] = useState(false);

  const currentLocale = pathname.split("/")[1] || "ru";
  const [language, setLanguage] = useState(currentLocale);

  useEffect(() => {
    setLanguage(currentLocale);
  }, [currentLocale]);

  const themeOptions = [
    { value: "light", label: t("themeLight") },
    { value: "dark", label: t("themeDark") },
  ];

  const languageOptions = [
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
    { value: "uk", label: "Українська" },
    { value: "ro", label: "Română" },
  ];

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/"));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.title}>{t("pageTitle")}</div>
          <div className={styles.subtitle}>{t("pageSubtitle")}</div>
        </header>

        <div className={styles.actions}>
          <Button onClick={handleSave} loading={saving}>
            <SaveIcon />
            {t("saveButton")}
          </Button>
        </div>

        <Tabs
          tabs={[
            { id: "notifications", label: t("notificationsTab") },
            { id: "interface", label: t("interfaceTab") },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabId)}
        />

        {activeTab === "notifications" && (
          <div className={styles.card}>
            <div className={styles.notificationsList}>
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationTitle}>{t("emailNotifications")}</div>
                  <div className={styles.notificationDesc}>{t("emailNotificationsDesc")}</div>
                </div>
                <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationTitle}>{t("pushNotifications")}</div>
                  <div className={styles.notificationDesc}>{t("pushNotificationsDesc")}</div>
                </div>
                <Toggle checked={pushNotifications} onChange={setPushNotifications} />
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <div className={styles.notificationTitle}>{t("monitoringAlerts")}</div>
                  <div className={styles.notificationDesc}>{t("monitoringAlertsDesc")}</div>
                </div>
                <Toggle checked={monitoringAlerts} onChange={setMonitoringAlerts} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "interface" && (
          <div className={styles.card}>
            <div className={styles.interfaceSettings}>
              <InputField
                type="select"
                label={t("themeLabel")}
                options={themeOptions}
                value={theme}
                onChange={(val) => setTheme(val as "light" | "dark")}
                variant="white"
              />
              <InputField
                type="select"
                label={t("languageLabel")}
                options={languageOptions}
                value={language}
                onChange={handleLanguageChange}
                variant="white"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function SaveIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3V8H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21V15H15V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
