"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../hero/hero.module.scss";

type ReviewsContent = {
  locale: string;
  title: string;
  subtitle: string;
  items: ReviewItem[];
};

type ReviewItem = {
  id: number;
  author_name: string;
  author_role: string;
  author_company?: string;
  author_avatar?: string;
  rating: number;
  text: string;
  from_label?: string;
  rating_label?: string;
  order: number;
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: ReviewsContent = {
  locale: "ru",
  title: "",
  subtitle: "",
  items: [],
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
      
      // Сохраняем заголовки
      const headersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews?lang=${selectedLocale}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: content.title,
            subtitle: content.subtitle,
          }),
        }
      );
      if (!headersRes.ok) throw new Error("Failed to save headers");

      // Сохраняем все отзывы
      for (const item of content.items) {
        const itemRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews/items/${item.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              author_name: item.author_name,
              author_role: item.author_role,
              author_company: item.author_company,
              author_avatar: item.author_avatar,
              rating: item.rating,
              text: item.text,
              from_label: item.from_label,
              rating_label: item.rating_label,
              order: item.order,
            }),
          }
        );
        if (!itemRes.ok) throw new Error(`Failed to save review ${item.id}`);
      }

      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Все изменения сохранены!" });
    } catch (err) {
      setMessage({ type: "error", text: "Не удалось сохранить изменения" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews/items?lang=${selectedLocale}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            author_name: "Имя автора",
            author_role: "Должность",
            author_company: "Компания",
            rating: 5,
            text: "Текст отзыва",
            order: content.items.length,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add review");
      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Отзыв добавлен!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось добавить отзыв" });
    }
  };

  const handleUpdateReview = async (itemId: number, updates: Partial<ReviewItem>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews/items/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updates),
        }
      );
      if (!res.ok) throw new Error("Failed to update review");
      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Отзыв обновлён!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось обновить отзыв" });
    }
  };

  const handleDeleteReview = async (itemId: number) => {
    if (!confirm("Удалить этот отзыв?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews/items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete review");
      await fetchContent(selectedLocale);
      setMessage({ type: "success", text: "Отзыв удалён!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось удалить отзыв" });
    }
  };

  const handleUploadAvatar = async (itemId: number, file: File) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/reviews/items/${itemId}/upload-avatar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload");
      
      const data = await res.json();
      // Обновляем локальный стейт
      const newItems = content.items.map(i => 
        i.id === itemId ? { ...i, author_avatar: data.image_url } : i
      );
      setContent({ ...content, items: newItems });
      setMessage({ type: "success", text: "Аватар загружен!" });
    } catch {
      setMessage({ type: "error", text: "Не удалось загрузить аватар" });
    }
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
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Подзаголовок</label>
            <textarea
              rows={3}
              value={content.subtitle}
              onChange={(e) => setContent((prev) => ({ ...prev, subtitle: e.target.value }))}
            />
          </div>

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving} style={{marginTop: "24px"}}>
            {saving ? "Сохранение..." : "Сохранить всё"}
          </button>

          <h3 className={styles.statsHeader}>Отзывы</h3>
          <button type="button" className={styles.addBtn} onClick={handleAddReview} style={{marginBottom: "16px"}}>
            + Добавить отзыв
          </button>

          {content.items && content.items.length > 0 && (
            <div className={styles.cardsGrid}>
              {content.items.map((item) => (
                <div key={item.id} className={styles.cardEdit} style={{border: "1px solid #ddd", padding: "16px", borderRadius: "8px"}}>
                  <div className={styles.formGroup}>
                    <label>Имя автора</label>
                    <input
                      type="text"
                      value={item.author_name}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, author_name: e.target.value } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Должность</label>
                    <input
                      type="text"
                      value={item.author_role}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, author_role: e.target.value } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Компания</label>
                    <input
                      type="text"
                      value={item.author_company || ""}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, author_company: e.target.value } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Аватар</label>
                    {item.author_avatar && (
                      <div style={{ marginBottom: "8px" }}>
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}${item.author_avatar}`} 
                          alt="Avatar" 
                          style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadAvatar(item.id, file);
                        }
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Рейтинг (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={item.rating}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, rating: parseInt(e.target.value) } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Текст отзыва</label>
                    <textarea
                      value={item.text}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, text: e.target.value } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                      rows={4}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Текст "От:"</label>
                    <input
                      type="text"
                      value={item.from_label || ""}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, from_label: e.target.value } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Текст "Рейтинг"</label>
                    <input
                      type="text"
                      value={item.rating_label || ""}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, rating_label: e.target.value } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Порядок</label>
                    <input
                      type="number"
                      value={item.order}
                      onChange={(e) => {
                        const newItems = content.items.map(i => 
                          i.id === item.id ? { ...i, order: parseInt(e.target.value) } : i
                        );
                        setContent({ ...content, items: newItems });
                      }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteReview(item.id)}
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
                    Удалить отзыв
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
