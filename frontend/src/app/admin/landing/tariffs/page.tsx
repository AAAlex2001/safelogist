"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./tariffs.module.scss";

type TariffsContent = {
  locale: string;
  title: string;
  subtitle: string;
  card1_badge: string;
  card1_title: string;
  card1_price: string;
  card1_period: string;
  card1_note: string;
  card1_features: string;
  card1_cta: string;
  card2_badge: string;
  card2_title: string;
  card2_price: string;
  card2_period: string;
  card2_note: string;
  card2_features: string;
  card2_cta: string;
  card2_popular: boolean;
  card3_badge: string;
  card3_title: string;
  card3_price: string;
  card3_period: string;
  card3_note: string;
  card3_features: string;
  card3_cta: string;
};

const LOCALES = ["ru", "en", "uk", "ro"];

const emptyContent: TariffsContent = {
  locale: "ru",
  title: "",
  subtitle: "",
  card1_badge: "",
  card1_title: "",
  card1_price: "",
  card1_period: "",
  card1_note: "",
  card1_features: "",
  card1_cta: "",
  card2_badge: "",
  card2_title: "",
  card2_price: "",
  card2_period: "",
  card2_note: "",
  card2_features: "",
  card2_cta: "",
  card2_popular: true,
  card3_badge: "",
  card3_title: "",
  card3_price: "",
  card3_period: "",
  card3_note: "",
  card3_features: "",
  card3_cta: "",
};

export default function TariffsAdminPage() {
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [content, setContent] = useState<TariffsContent>(emptyContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = useCallback(async (locale: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/tariffs?lang=${locale}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setContent({
          locale: data.locale,
          title: data.title,
          subtitle: data.subtitle,
          card1_badge: data.cards[0]?.badge || "",
          card1_title: data.cards[0]?.title || "",
          card1_price: data.cards[0]?.price || "",
          card1_period: data.cards[0]?.period || "",
          card1_note: data.cards[0]?.note || "",
          card1_features: data.cards[0]?.features?.join("\n") || "",
          card1_cta: data.cards[0]?.cta || "",
          card2_badge: data.cards[1]?.badge || "",
          card2_title: data.cards[1]?.title || "",
          card2_price: data.cards[1]?.price || "",
          card2_period: data.cards[1]?.period || "",
          card2_note: data.cards[1]?.note || "",
          card2_features: data.cards[1]?.features?.join("\n") || "",
          card2_cta: data.cards[1]?.cta || "",
          card2_popular: data.cards[1]?.popular ?? true,
          card3_badge: data.cards[2]?.badge || "",
          card3_title: data.cards[2]?.title || "",
          card3_price: data.cards[2]?.price || "",
          card3_period: data.cards[2]?.period || "",
          card3_note: data.cards[2]?.note || "",
          card3_features: data.cards[2]?.features?.join("\n") || "",
          card3_cta: data.cards[2]?.cta || "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/landing/tariffs?lang=${selectedLocale}`,
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

  const updateField = <K extends keyof TariffsContent>(field: K, value: TariffsContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tariffs секция</h1>

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

          {[1, 2, 3].map((i) => (
            <div key={i}>
              <h3 className={styles.statsHeader}>Карточка {i}</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statBlock}>
                  <div className={styles.formGroup}>
                    <label>Badge</label>
                    <input
                      type="text"
                      value={content[`card${i}_badge` as keyof TariffsContent] as string}
                      onChange={(e) => updateField(`card${i}_badge` as keyof TariffsContent, e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Название</label>
                    <input
                      type="text"
                      value={content[`card${i}_title` as keyof TariffsContent] as string}
                      onChange={(e) => updateField(`card${i}_title` as keyof TariffsContent, e.target.value)}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Цена</label>
                      <input
                        type="text"
                        value={content[`card${i}_price` as keyof TariffsContent] as string}
                        onChange={(e) => updateField(`card${i}_price` as keyof TariffsContent, e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Период</label>
                      <input
                        type="text"
                        value={content[`card${i}_period` as keyof TariffsContent] as string}
                        onChange={(e) => updateField(`card${i}_period` as keyof TariffsContent, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.statBlock}>
                  <div className={styles.formGroup}>
                    <label>Примечание</label>
                    <input
                      type="text"
                      value={content[`card${i}_note` as keyof TariffsContent] as string}
                      onChange={(e) => updateField(`card${i}_note` as keyof TariffsContent, e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>CTA кнопка</label>
                    <input
                      type="text"
                      value={content[`card${i}_cta` as keyof TariffsContent] as string}
                      onChange={(e) => updateField(`card${i}_cta` as keyof TariffsContent, e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Фичи (по одной на строку)</label>
                    <textarea
                      rows={3}
                      value={content[`card${i}_features` as keyof TariffsContent] as string}
                      onChange={(e) => updateField(`card${i}_features` as keyof TariffsContent, e.target.value)}
                    />
                  </div>
                  {i === 2 && (
                    <div className={styles.formGroup}>
                      <label>
                        <input
                          type="checkbox"
                          checked={content.card2_popular}
                          onChange={(e) => updateField("card2_popular", e.target.checked)}
                          style={{ marginRight: 8 }}
                        />
                        Популярный тариф
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
