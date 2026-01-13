"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../../admin.module.scss";

type Review = {
  id: number;
  subject: string;
  review_id: string;
  comment: string | null;
  reviewer: string | null;
  rating: number | null;
  status: string | null;
  review_date: string | null;
  source: string | null;
  jurisdiction: string | null;
  country: string | null;
  company_number: string | null;
  legal_form: string | null;
  inn: string | null;
  ogrn: string | null;
  created_at: string;
};

type CompanyInfo = {
  name: string;
  reviews_count: number;
  logo: string | null;
  description: string | null;
  website: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_person: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export default function AdminCompanyPage() {
  const params = useParams<{ companyId: string }>();
  const minReviewId = Number(params.companyId);

  const [companyName, setCompanyName] = useState<string>("");
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<Review | null>(null);

  useEffect(() => {
    fetchCompanyData();
  }, [minReviewId]);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      // Получаем имя компании по min_review_id
      const nameRes = await fetch(`${API_URL}/api/admin/reviews/company-name-by-id/${minReviewId}`);
      const nameData = await nameRes.json();
      setCompanyName(nameData.company_name || "");

      // Получаем все отзывы компании
      const reviewsRes = await fetch(`${API_URL}/api/admin/reviews/company/${encodeURIComponent(nameData.company_name)}`);
      const reviewsData = await reviewsRes.json();
      setAllReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error(err);
      setAllReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (review: Review) => {
    setEditModal({ ...review });
  };

  const saveReview = async () => {
    if (!editModal) return;
    try {
      await fetch(`${API_URL}/api/admin/reviews/${editModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editModal),
      });
      setEditModal(null);
      fetchCompanyData();
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении");
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Удалить этот отзыв?")) return;
    try {
      await fetch(`${API_URL}/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      fetchCompanyData();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/reviews" className={`${styles.actionBtn} ${styles.toggle}`}>
          ← Назад к списку
        </Link>
      </div>

      <h1 className={styles.pageTitle}>
        Отзывы: {companyName}
      </h1>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : allReviews.length === 0 ? (
        <div className={styles.empty}>Нет отзывов</div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
          gap: "20px",
          width: "100%"
        }}>
          {allReviews.map((review) => (
            <div 
              key={review.id}
              style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <strong style={{ fontSize: "14px" }}>ID: {review.id}</strong>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      {review.source || "—"}
                    </div>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>
                    {review.rating ? `⭐ ${review.rating}` : "—"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Отзыв от:</div>
                  <div style={{ fontSize: "14px" }}>{review.reviewer || "—"}</div>
                </div>

                {review.comment && (
                  <div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Комментарий:</div>
                    <div style={{ 
                      fontSize: "14px", 
                      lineHeight: "1.5",
                      maxHeight: "120px",
                      overflow: "auto"
                    }}>
                      {review.comment}
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                  <div>
                    <span style={{ color: "#666" }}>Дата: </span>
                    {review.review_date ? new Date(review.review_date).toLocaleDateString("ru-RU") : "—"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Юрисдикция: </span>
                    {review.jurisdiction || "—"}
                  </div>
                  {review.inn && (
                    <div>
                      <span style={{ color: "#666" }}>ИНН: </span>
                      {review.inn}
                    </div>
                  )}
                  {review.ogrn && (
                    <div>
                      <span style={{ color: "#666" }}>ОГРН: </span>
                      {review.ogrn}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <button
                    className={`${styles.actionBtn} ${styles.toggle}`}
                    onClick={() => openEditModal(review)}
                    style={{ flex: 1 }}
                  >
                    Изменить
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.reject}`}
                    onClick={() => deleteReview(review.id)}
                    style={{ flex: 1 }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {editModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: "800px", maxHeight: "90vh", overflow: "auto" }}>
            <h3>Редактировать отзыв #{editModal.id}</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Компания (subject)</label>
                <input
                  type="text"
                  value={editModal.subject}
                  onChange={(e) => setEditModal({ ...editModal, subject: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Источник (source)</label>
                <input
                  type="text"
                  value={editModal.source || ""}
                  onChange={(e) => setEditModal({ ...editModal, source: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Рейтинг (rating)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editModal.rating || ""}
                  onChange={(e) => setEditModal({ ...editModal, rating: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Отзыв от (reviewer)</label>
                <input
                  type="text"
                  value={editModal.reviewer || ""}
                  onChange={(e) => setEditModal({ ...editModal, reviewer: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Дата отзыва</label>
                <input
                  type="date"
                  value={editModal.review_date ? editModal.review_date.split('T')[0] : ""}
                  onChange={(e) => setEditModal({ ...editModal, review_date: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Статус</label>
                <input
                  type="text"
                  value={editModal.status || ""}
                  onChange={(e) => setEditModal({ ...editModal, status: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>ИНН</label>
                <input
                  type="text"
                  value={editModal.inn || ""}
                  onChange={(e) => setEditModal({ ...editModal, inn: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>ОГРН</label>
                <input
                  type="text"
                  value={editModal.ogrn || ""}
                  onChange={(e) => setEditModal({ ...editModal, ogrn: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Юрисдикция</label>
                <input
                  type="text"
                  value={editModal.jurisdiction || ""}
                  onChange={(e) => setEditModal({ ...editModal, jurisdiction: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Страна</label>
                <input
                  type="text"
                  value={editModal.country || ""}
                  onChange={(e) => setEditModal({ ...editModal, country: e.target.value })}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Комментарий</label>
                <textarea
                  value={editModal.comment || ""}
                  onChange={(e) => setEditModal({ ...editModal, comment: e.target.value })}
                  rows={4}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                className={`${styles.actionBtn} ${styles.toggle}`}
                onClick={() => setEditModal(null)}
              >
                Отмена
              </button>
              <button
                className={`${styles.actionBtn} ${styles.approve}`}
                onClick={saveReview}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
