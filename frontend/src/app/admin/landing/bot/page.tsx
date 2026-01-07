"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./bot.module.scss";

type BotContent = {
  locale: string;
  title: string;
  subtitle_text: string;
  subtitle_link_text: string;
  subtitle_link_url: string;
  subtitle_after_link: string | null;
  item1_title: string;
  item1_text: string;
  item2_title: string;
  item2_text: string;
  item3_title: string;
  item3_text: string;
  bot_handle: string;
  bot_url: string;
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: BotContent = {
  locale: "ru",
  title: "",
  subtitle_text: "",
  subtitle_link_text: "",
  subtitle_link_url: "",
  subtitle_after_link: "",
  item1_title: "",
  item1_text: "",
  item2_title: "",
  item2_text: "",
  item3_title: "",
  item3_text: "",
  bot_handle: "",
  bot_url: "",
};

export default function BotAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [content, setContent] = useState<BotContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/bot?lang=${locale}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setContent({
          locale: data.locale,
          title: data.title,
          subtitle_text: data.subtitle_text,
          subtitle_link_text: data.subtitle_link_text,
          subtitle_link_url: data.subtitle_link_url,
          subtitle_after_link: data.subtitle_after_link || "",
          item1_title: data.items[0]?.title || "",
          item1_text: data.items[0]?.text || "",
          item2_title: data.items[1]?.title || "",
          item2_text: data.items[1]?.text || "",
          item3_title: data.items[2]?.title || "",
          item3_text: data.items[2]?.text || "",
          bot_handle: data.bot_handle,
          bot_url: data.bot_url,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/bot?lang=${selectedLocale}`,
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

  const updateField = <K extends keyof BotContent>(field: K, value: BotContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bot секция</h1>

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

          <h3 className={styles.statsHeader}>Подзаголовок</h3>
          <div className={styles.formGroup}>
            <label>Текст перед ссылкой</label>
            <input type="text" value={content.subtitle_text} onChange={(e) => updateField("subtitle_text", e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Текст ссылки</label>
              <input type="text" value={content.subtitle_link_text} onChange={(e) => updateField("subtitle_link_text", e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>URL ссылки</label>
              <input type="text" value={content.subtitle_link_url} onChange={(e) => updateField("subtitle_link_url", e.target.value)} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Текст после ссылки</label>
            <input type="text" value={content.subtitle_after_link ?? ""} onChange={(e) => updateField("subtitle_after_link", e.target.value)} />
          </div>

          <h3 className={styles.statsHeader}>Элементы списка</h3>
          <div className={styles.statsGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.statBlock}>
                <h4>Элемент {i}</h4>
                <div className={styles.formGroup}>
                  <label>Заголовок</label>
                  <input
                    type="text"
                    value={content[`item${i}_title` as keyof BotContent] as string}
                    onChange={(e) => updateField(`item${i}_title` as keyof BotContent, e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Текст</label>
                  <input
                    type="text"
                    value={content[`item${i}_text` as keyof BotContent] as string}
                    onChange={(e) => updateField(`item${i}_text` as keyof BotContent, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.statsHeader}>Бот</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Handle (@...)</label>
              <input type="text" value={content.bot_handle} onChange={(e) => updateField("bot_handle", e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>URL</label>
              <input type="text" value={content.bot_url} onChange={(e) => updateField("bot_url", e.target.value)} />
            </div>
          </div>

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
