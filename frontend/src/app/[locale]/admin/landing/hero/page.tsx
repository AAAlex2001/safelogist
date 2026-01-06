"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./hero.module.scss";

type HeroContent = {
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

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyHeroContent: HeroContent = {
  locale: "ru",
  title: "",
  title_highlight: "",
  subtitle: "",
  stat_companies_label: "",
  stat_companies_value: 0,
  stat_companies_suffix: "",
  stat_reviews_label: "",
  stat_reviews_value: 0,
  stat_reviews_suffix: "",
  stat_countries_label: "",
  stat_countries_value: 0,
  stat_countries_suffix: "",
  stat_sources_label: "",
  stat_sources_value: 0,
  stat_sources_suffix: "",
};

export default function HeroAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [heroContent, setHeroContent] = useState<HeroContent>(emptyHeroContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchHeroContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/hero?lang=${locale}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setHeroContent(data);
      } else if (res.status === 404) {
        // Контент ещё не создан для этой локали
        setHeroContent({ ...emptyHeroContent, locale });
      } else {
        throw new Error("Failed to fetch");
      }
    } catch {
      setMessage({ type: "error", text: "Не удалось загрузить контент" });
      setHeroContent({ ...emptyHeroContent, locale });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroContent(selectedLocale);
  }, [selectedLocale, fetchHeroContent]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/hero?lang=${selectedLocale}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(heroContent),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "Hero контент сохранён!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось сохранить контент" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof HeroContent>(field: K, value: HeroContent[K]) => {
    setHeroContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hero секция</h1>

      {/* Locale selector */}
      <div className={styles.localeSelector}>
        {LOCALES.map((loc) => (
          <button
            key={loc}
            className={`${styles.localeBtn} ${selectedLocale === loc ? styles.active : ""}`}
            onClick={() => setSelectedLocale(loc)}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Заголовок</label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Основной заголовок"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Выделенная часть заголовка</label>
            <input
              type="text"
              value={heroContent.title_highlight ?? ""}
              onChange={(e) => updateField("title_highlight", e.target.value)}
              placeholder="Часть текста для выделения"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Подзаголовок</label>
            <textarea
              value={heroContent.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Описание"
              rows={3}
            />
          </div>

          <h3 className={styles.statsHeader}>Статистика</h3>

          <div className={styles.statsGrid}>
            {/* Companies stat */}
            <div className={styles.statBlock}>
              <h4>Компании</h4>
              <div className={styles.formGroup}>
                <label>Подпись</label>
                <input
                  type="text"
                  value={heroContent.stat_companies_label}
                  onChange={(e) => updateField("stat_companies_label", e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Значение</label>
                  <input
                    type="number"
                    value={heroContent.stat_companies_value}
                    onChange={(e) => updateField("stat_companies_value", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Суффикс</label>
                  <input
                    type="text"
                    value={heroContent.stat_companies_suffix ?? ""}
                    onChange={(e) => updateField("stat_companies_suffix", e.target.value)}
                    placeholder="+, M, и т.д."
                  />
                </div>
              </div>
            </div>

            {/* Reviews stat */}
            <div className={styles.statBlock}>
              <h4>Отзывы</h4>
              <div className={styles.formGroup}>
                <label>Подпись</label>
                <input
                  type="text"
                  value={heroContent.stat_reviews_label}
                  onChange={(e) => updateField("stat_reviews_label", e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Значение</label>
                  <input
                    type="number"
                    value={heroContent.stat_reviews_value}
                    onChange={(e) => updateField("stat_reviews_value", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Суффикс</label>
                  <input
                    type="text"
                    value={heroContent.stat_reviews_suffix ?? ""}
                    onChange={(e) => updateField("stat_reviews_suffix", e.target.value)}
                    placeholder="+, M, и т.д."
                  />
                </div>
              </div>
            </div>

            {/* Countries stat */}
            <div className={styles.statBlock}>
              <h4>Страны</h4>
              <div className={styles.formGroup}>
                <label>Подпись</label>
                <input
                  type="text"
                  value={heroContent.stat_countries_label}
                  onChange={(e) => updateField("stat_countries_label", e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Значение</label>
                  <input
                    type="number"
                    value={heroContent.stat_countries_value}
                    onChange={(e) => updateField("stat_countries_value", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Суффикс</label>
                  <input
                    type="text"
                    value={heroContent.stat_countries_suffix ?? ""}
                    onChange={(e) => updateField("stat_countries_suffix", e.target.value)}
                    placeholder="+, M, и т.д."
                  />
                </div>
              </div>
            </div>

            {/* Sources stat */}
            <div className={styles.statBlock}>
              <h4>Источники</h4>
              <div className={styles.formGroup}>
                <label>Подпись</label>
                <input
                  type="text"
                  value={heroContent.stat_sources_label}
                  onChange={(e) => updateField("stat_sources_label", e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Значение</label>
                  <input
                    type="number"
                    value={heroContent.stat_sources_value}
                    onChange={(e) => updateField("stat_sources_value", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Суффикс</label>
                  <input
                    type="text"
                    value={heroContent.stat_sources_suffix ?? ""}
                    onChange={(e) => updateField("stat_sources_suffix", e.target.value)}
                    placeholder="+, %, и т.д."
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
