"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./faq.module.scss";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqContent = {
  locale: string;
  title: string;
  items: FaqItem[];
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: FaqContent = {
  locale: "ru",
  title: "",
  items: [{ question: "", answer: "" }, { question: "", answer: "" }],
};

export default function FaqAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [content, setContent] = useState<FaqContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/faq?lang=${locale}`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/faq?lang=${selectedLocale}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: content.title,
            items: JSON.stringify(content.items),
          }),
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

  const updateItem = (index: number, field: keyof FaqItem, value: string) => {
    setContent((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => {
    setContent((prev) => ({
      ...prev,
      items: [...prev.items, { question: "", answer: "" }],
    }));
  };

  const removeItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FAQ секция</h1>

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
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <h3 className={styles.statsHeader}>Вопросы</h3>
          {content.items.map((item, index) => (
            <div key={index} className={styles.statBlock} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4>Вопрос {index + 1}</h4>
                {content.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{ background: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}
                  >
                    Удалить
                  </button>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Вопрос</label>
                <input type="text" value={item.question} onChange={(e) => updateItem(index, "question", e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Ответ</label>
                <textarea rows={3} value={item.answer} onChange={(e) => updateItem(index, "answer", e.target.value)} />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            style={{ background: "#28a745", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", marginBottom: 16 }}
          >
            + Добавить вопрос
          </button>

          <br />
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
