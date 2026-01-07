"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../hero/hero.module.scss";

type StepsContent = {
  locale: string;
  title: string;
  subtitle: string;
  step1_counter: string;
  step1_title: string;
  step1_text: string;
  step2_counter: string;
  step2_title: string;
  step2_text: string;
  step2_image?: string;
  step3_counter: string;
  step3_title: string;
  step3_text: string;
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: StepsContent = {
  locale: "ru",
  title: "",
  subtitle: "",
  step1_counter: "",
  step1_title: "",
  step1_text: "",
  step2_counter: "",
  step2_title: "",
  step2_text: "",
  step2_image: "",
  step3_counter: "",
  step3_title: "",
  step3_text: "",
};

export default function StepsAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [content, setContent] = useState<StepsContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/steps?lang=${locale}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setContent({
          locale: data.locale,
          title: data.title,
          subtitle: data.subtitle,
          step1_counter: data.steps[0]?.counter || "",
          step1_title: data.steps[0]?.title || "",
          step1_text: data.steps[0]?.text || "",
          step2_counter: data.steps[1]?.counter || "",
          step2_title: data.steps[1]?.title || "",
          step2_image: data.step2_image || "",
          step2_text: data.steps[1]?.text || "",
          step3_counter: data.steps[2]?.counter || "",
          step3_title: data.steps[2]?.title || "",
          step3_text: data.steps[2]?.text || "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/steps?lang=${selectedLocale}`,
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

  co

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/steps/upload-image?lang=${selectedLocale}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload");
      
      const data = await res.json();
      updateField("step2_image", data.image_url);
      setMessage({ type: "success", text: "Изображение загружено!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось загрузить изображение" });
    } finally {
      setUploading(false);
    }
  };nst updateField = <K extends keyof StepsContent>(field: K, value: StepsContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Steps секция</h1>

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
            <t  {i === 2 && (
                  <div className={styles.formGroup}>
                    <label>Изображение для Step 2</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <p style={{ fontSize: "12px", color: "#666" }}>Загрузка...</p>}
                    {content.step2_image && (
                      <div style={{ marginTop: "8px" }}>
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}${content.step2_image}`} 
                          alt="Step 2" 
                          style={{ maxWidth: "200px", display: "block", marginTop: "8px" }}
                        />
                        <input
                          type="text"
                          value={content.step2_image}
                          onChange={(e) => updateField("step2_image", e.target.value)}
                          placeholder="URL изображения"
                          style={{ marginTop: "8px", fontSize: "12px" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              extarea rows={3} value={content.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
          </div>

          <h3 className={styles.statsHeader}>Шаги</h3>
          <div className={styles.statsGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.statBlock}>
                <h4>Шаг {i}</h4>
                <div className={styles.formGroup}>
                  <label>Счётчик</label>
                  <input
                    type="text"
                    value={content[`step${i}_counter` as keyof StepsContent] as string}
                    onChange={(e) => updateField(`step${i}_counter` as keyof StepsContent, e.target.value)}
                    placeholder={`Шаг ${i} из 3.`}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Заголовок</label>
                  <input
                    type="text"
                    value={content[`step${i}_title` as keyof StepsContent] as string}
                    onChange={(e) => updateField(`step${i}_title` as keyof StepsContent, e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Текст</label>
                  <input
                    type="text"
                    value={content[`step${i}_text` as keyof StepsContent] as string}
                    onChange={(e) => updateField(`step${i}_text` as keyof StepsContent, e.target.value)}
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
