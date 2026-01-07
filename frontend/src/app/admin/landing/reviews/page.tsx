"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../hero/hero.module.scss";

type ReviewsContent = {
  locale: string;
  title: string;
  subtitle: string;
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: ReviewsContent = {
  locale: "ru",
  title: "",
  subtitle: "",
};

export default function ReviewsAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [content, setContent] = useState<ReviewsContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews?lang=${locale}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setContent(await res.json());
      } else if (res.status === 404) {
        setContent({ ...emptyContent, locale });
      } else {
        throw new Error("Failed to fetch");
      }
    } catch {
      setMessage({ type: "error", text: "Не удалось загрузить контент" });
      setContent({ ...emptyContent, locale });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(selectedLocale);
  }, [selectedLocale, fetchContent]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews?lang=${selectedLocale}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(content),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "Контент сохранён!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось сохранить контент" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof ReviewsContent>(field: K, value: ReviewsContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reviews секция</h1>

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

      {message && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Заголовок</label>
            <input type="text" value={content.title} onChange={(e) => updateField("title", e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label>Подзаголовок</label>
            <input type="text" value={content.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
          </div>

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
