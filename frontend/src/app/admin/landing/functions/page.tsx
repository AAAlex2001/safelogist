"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../hero/hero.module.scss";

type FunctionsContent = {
  locale: string;
  title: string;
  subtitle: string;
  tab1_label: string;
  tab2_label: string;
  tab1_item1_title: string;
  tab1_item1_text: string;
  tab1_item2_title: string;
  tab1_item2_text: string;
  tab1_item3_title: string;
  tab1_item3_text: string;
  tab1_item4_title: string;
  tab1_item4_text: string;
  tab2_item1_title: string;
  tab2_item1_text: string;
  tab2_item2_title: string;
  tab2_item2_text: string;
  tab2_item3_title: string;
  tab2_item3_text: string;
  tab2_item4_title: string;
  tab2_item4_text: string;
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: FunctionsContent = {
  locale: "ru",
  title: "",
  subtitle: "",
  tab1_label: "",
  tab2_label: "",
  tab1_item1_title: "",
  tab1_item1_text: "",
  tab1_item2_title: "",
  tab1_item2_text: "",
  tab1_item3_title: "",
  tab1_item3_text: "",
  tab1_item4_title: "",
  tab1_item4_text: "",
  tab2_item1_title: "",
  tab2_item1_text: "",
  tab2_item2_title: "",
  tab2_item2_text: "",
  tab2_item3_title: "",
  tab2_item3_text: "",
  tab2_item4_title: "",
  tab2_item4_text: "",
};

export default function FunctionsAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [content, setContent] = useState<FunctionsContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/functions?lang=${locale}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setContent({
          locale: data.locale,
          title: data.title,
          subtitle: data.subtitle,
          tab1_label: data.tab1_label,
          tab2_label: data.tab2_label,
          tab1_item1_title: data.tab1_items[0]?.title || "",
          tab1_item1_text: data.tab1_items[0]?.text || "",
          tab1_item2_title: data.tab1_items[1]?.title || "",
          tab1_item2_text: data.tab1_items[1]?.text || "",
          tab1_item3_title: data.tab1_items[2]?.title || "",
          tab1_item3_text: data.tab1_items[2]?.text || "",
          tab1_item4_title: data.tab1_items[3]?.title || "",
          tab1_item4_text: data.tab1_items[3]?.text || "",
          tab2_item1_title: data.tab2_items[0]?.title || "",
          tab2_item1_text: data.tab2_items[0]?.text || "",
          tab2_item2_title: data.tab2_items[1]?.title || "",
          tab2_item2_text: data.tab2_items[1]?.text || "",
          tab2_item3_title: data.tab2_items[2]?.title || "",
          tab2_item3_text: data.tab2_items[2]?.text || "",
          tab2_item4_title: data.tab2_items[3]?.title || "",
          tab2_item4_text: data.tab2_items[3]?.text || "",
        });
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/functions?lang=${selectedLocale}`,
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

  const updateField = <K extends keyof FunctionsContent>(field: K, value: FunctionsContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Functions секция</h1>

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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tab 1 - Название</label>
              <input type="text" value={content.tab1_label} onChange={(e) => updateField("tab1_label", e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Tab 2 - Название</label>
              <input type="text" value={content.tab2_label} onChange={(e) => updateField("tab2_label", e.target.value)} />
            </div>
          </div>

          <h3 className={styles.statsHeader}>Tab 1 - Элементы</h3>
          <div className={styles.statsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.statBlock}>
                <h4>Элемент {i}</h4>
                <div className={styles.formGroup}>
                  <label>Заголовок</label>
                  <input
                    type="text"
                    value={content[`tab1_item${i}_title` as keyof FunctionsContent] as string}
                    onChange={(e) => updateField(`tab1_item${i}_title` as keyof FunctionsContent, e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Текст</label>
                  <input
                    type="text"
                    value={content[`tab1_item${i}_text` as keyof FunctionsContent] as string}
                    onChange={(e) => updateField(`tab1_item${i}_text` as keyof FunctionsContent, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.statsHeader}>Tab 2 - Элементы</h3>
          <div className={styles.statsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.statBlock}>
                <h4>Элемент {i}</h4>
                <div className={styles.formGroup}>
                  <label>Заголовок</label>
                  <input
                    type="text"
                    value={content[`tab2_item${i}_title` as keyof FunctionsContent] as string}
                    onChange={(e) => updateField(`tab2_item${i}_title` as keyof FunctionsContent, e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Текст</label>
                  <input
                    type="text"
                    value={content[`tab2_item${i}_text` as keyof FunctionsContent] as string}
                    onChange={(e) => updateField(`tab2_item${i}_text` as keyof FunctionsContent, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
