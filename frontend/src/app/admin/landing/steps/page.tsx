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
  cards?: StepsCard[];
};

type StepsCard = {
  id: number;
  title: string;
  description: string;
  icon?: string;
  reviews_count?: number;
  reviews_text?: string;
  rating?: number;
  rating_label?: string;
  order: number;
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
  cards: [],
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
          cards: data.cards || [],
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

  const updateField = <K extends keyof StepsContent>(field: K, value: StepsContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

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
  };

  const handleAddCard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/steps/cards?lang=${selectedLocale}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: "Новая карточка",
            description: "Описание карточки",
            reviews_count: 24,
            reviews_text: "отзывов о подрядчике",
            rating: 5.0,
            rating_label: "Рейтинг",
            order: content.cards?.length || 0,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add card");
      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Карточка добавлена!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось добавить карточку" });
    }
  };

  const handleUpdateCard = async (cardId: number, updates: Partial<StepsCard>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/steps/cards/${cardId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updates),
        }
      );
      if (!res.ok) throw new Error("Failed to update card");
      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Карточка обновлена!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось обновить карточку" });
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("Удалить эту карточку?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/steps/cards/${cardId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete card");
      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Карточка удалена!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось удалить карточку" });
    }
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
            <textarea rows={3} value={content.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
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
                {i === 2 && (
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
              </div>
            ))}
          </div>

          <h3 className={styles.statsHeader}>Карточки для Step 3</h3>
          <button type="button" className={styles.addBtn} onClick={handleAddCard} style={{marginBottom: "16px"}}>
            + Добавить карточку
          </button>
          {content.cards && content.cards.length > 0 && (
            <div className={styles.cardsGrid}>
              {content.cards.map((card) => (
                <div key={card.id} className={styles.cardEdit}>
                  <div className={styles.formGroup}>
                    <label>Заголовок</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                      onBlur={() => {}}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Описание</label>
                    <textarea
                      value={card.description}
                      onChange={(e) => handleUpdateCard(card.id, { description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Количество отзывов</label>
                    <input
                      type="number"
                      value={card.reviews_count ?? 24}
                      onChange={(e) => handleUpdateCard(card.id, { reviews_count: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Текст "отзывов о подрядчике"</label>
                    <input
                      type="text"
                      value={card.reviews_text ?? "отзывов о подрядчике"}
                      onChange={(e) => handleUpdateCard(card.id, { reviews_text: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Рейтинг (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={card.rating ?? 5.0}
                      onChange={(e) => handleUpdateCard(card.id, { rating: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Текст "Рейтинг"</label>
                    <input
                      type="text"
                      value={card.rating_label ?? "Рейтинг"}
                      onChange={(e) => handleUpdateCard(card.id, { rating_label: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Порядок</label>
                    <input
                      type="number"
                      value={card.order}
                      onChange={(e) => handleUpdateCard(card.id, { order: parseInt(e.target.value) })}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteCard(card.id)}
                    style={{
                      marginTop: "8px",
                      padding: "8px 16px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
