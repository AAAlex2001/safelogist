"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ReviewCard } from "@/app/[locale]/reviews-profile/components/ReviewCard/ReviewCard";
import styles from "../admin.module.scss";

type ReviewRequest = {
  id: number;
  user_id: number;
  from_company: string;
  target_company: string;
  rating: number;
  comment: string;
  attachment_path: string | null;
  attachment_name: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  admin_comment: string | null;
  created_at: string;
  updated_at: string;
};

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
  registration_number: string | null;
  registration_date: string | null;
  legal_form: string | null;
  short_name: string | null;
  cin: string | null;
  authorized_capital: string | null;
  paid_up_capital: string | null;
  subtype: string | null;
  activity_type: string | null;
  legal_address: string | null;
  mailing_address: string | null;
  ogrn: string | null;
  inn: string | null;
  liquidation_date: string | null;
  managers: string | null;
  branch: string | null;
  fiscal_code: string | null;
  report_type: string | null;
  report_year: number | null;
  detail_data: Record<string, unknown> | null;
  detailed_data: Record<string, unknown> | null;
  cuiio: string | null;
  email: string | null;
  phone: string | null;
  postal_code: string | null;
  street_address: string | null;
  caem_code: string | null;
  caem_name: string | null;
  cfoj_code: string | null;
  cfoj_name: string | null;
  cfp_code: string | null;
  cfp_name: string | null;
  employees_count: string | null;
  accountant: string | null;
  accountant_phone: string | null;
  responsible_person: string | null;
  report_status: string | null;
  is_audited: boolean | null;
  declaration_date: string | null;
  web: string | null;
  cuatm_code: string | null;
  cuatm_name: string | null;
  entity_type: string | null;
  liquidation: boolean | null;
  period_from: string | null;
  period_to: string | null;
  signed: boolean | null;
  report_create_date: string | null;
  report_update_date: string | null;
  fiscal_date: string | null;
  economic_agent_id: string | null;
  import_file_name: string | null;
  employees_abs: string | null;
  organization_id: string | null;
  organization_name: string | null;
  fisc: string | null;
  legal_entity_id: string | null;
  created_at: string;
};

type Company = {
  name: string;
  slug: string;
  reviews_count: number;
  min_review_id: number;
};

type SearchCompany = {
  id: number;
  name: string;
  reviews_count?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type TabType = "requests" | "companies";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("requests");
  
  // Заявки
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [requestFilter, setRequestFilter] = useState<string>("PENDING");
  const [rejectModal, setRejectModal] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  // Компании (быстрый список)
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [companiesHasNext, setCompaniesHasNext] = useState(false);
  
  // Поиск inline
  const [searchResults, setSearchResults] = useState<SearchCompany[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Отзывы компании (для редактирования)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyReviews, setCompanyReviews] = useState<Review[]>([]);
  const [companyReviewsTotal, setCompanyReviewsTotal] = useState(0);
  const [minReviewId, setMinReviewId] = useState<number | null>(null);
  const [reviewsSortOrder, setReviewsSortOrder] = useState<"newest" | "oldest">("newest");
  
  // Модалки
  const [editReviewModal, setEditReviewModal] = useState<Review | null>(null);
  const [editCompanyModal, setEditCompanyModal] = useState<Review | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    } else {
      if (!searchQuery) {
        fetchCompanies();
      }
    }
  }, [activeTab, requestFilter, companiesPage]);

  // Обработчик inline поиска из SearchBar
  const handleInlineSearch = (results: SearchCompany[], isLoading: boolean, query: string) => {
    setSearchQuery(query);
    setSearchLoading(isLoading);
    setSearchResults(results);
  };

  // ========== ЗАЯВКИ ==========
  const fetchRequests = () => {
    setLoading(true);
    const url = requestFilter
      ? `${API_URL}/api/admin/review-requests?status=${requestFilter}`
      : `${API_URL}/api/admin/review-requests`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  const approveRequest = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/admin/review-requests/${id}/approve`, { method: "POST" });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async () => {
    if (!rejectModal) return;
    try {
      const formData = new FormData();
      formData.append("admin_comment", rejectReason);
      await fetch(`${API_URL}/api/admin/review-requests/${rejectModal}/reject`, {
        method: "POST",
        body: formData,
      });
      setRejectModal(null);
      setRejectReason("");
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm("Удалить эту заявку?")) return;
    try {
      await fetch(`${API_URL}/api/admin/review-requests/${id}`, { method: "DELETE" });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // ========== КОМПАНИИ (быстрый список) ==========
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/admin/companies?page=${companiesPage}&per_page=20`;
      const res = await fetch(url);
      const data = await res.json();
      setCompanies(data.companies || []);
      setCompaniesHasNext(data.has_next || false);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== ОТЗЫВЫ КОМПАНИИ ==========
  const fetchCompanyReviews = async (companyName: string) => {
    setLoading(true);
    setSelectedCompany(companyName);
    try {
      const res = await fetch(`${API_URL}/api/admin/companies/${encodeURIComponent(companyName)}/reviews`);
      const data = await res.json();
      setCompanyReviews(data.reviews || []);
      setCompanyReviewsTotal(data.total || 0);
      setMinReviewId(data.min_review_id || null);
    } catch (err) {
      console.error("Error fetching company reviews:", err);
      setCompanyReviews([]);
      setMinReviewId(null);
    } finally {
      setLoading(false);
    }
  };

  // Отсортированные отзывы
  const sortedReviews = [...companyReviews].sort((a, b) => {
    const dateA = new Date(a.review_date || a.created_at).getTime();
    const dateB = new Date(b.review_date || b.created_at).getTime();
    return reviewsSortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const saveReview = async () => {
    if (!editReviewModal) return;
    try {
      // Отправляем только поля отзыва
      const reviewData = {
        rating: editReviewModal.rating,
        comment: editReviewModal.comment,
        reviewer: editReviewModal.reviewer,
        source: editReviewModal.source,
        review_date: editReviewModal.review_date,
      };
      await fetch(`${API_URL}/api/admin/reviews/${editReviewModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      setEditReviewModal(null);
      if (selectedCompany) {
        fetchCompanyReviews(selectedCompany);
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении");
    }
  };

  const saveCompanyData = async () => {
    if (!editCompanyModal) return;
    try {
      // Отправляем все данные компании (не отзыва)
      await fetch(`${API_URL}/api/admin/reviews/${editCompanyModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCompanyModal),
      });
      setEditCompanyModal(null);
      if (selectedCompany) {
        fetchCompanyReviews(selectedCompany);
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении");
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Удалить этот отзыв?")) return;
    try {
      await fetch(`${API_URL}/api/admin/reviews/${id}`, { method: "DELETE" });
      if (selectedCompany) {
        fetchCompanyReviews(selectedCompany);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Вспомогательная функция для инпутов
  const updateReviewField = (field: keyof Review, value: unknown) => {
    if (editReviewModal) {
      setEditReviewModal({ ...editReviewModal, [field]: value });
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Управление отзывами</h1>

      {/* SearchBar с inline режимом */}
      <div style={{ marginBottom: "20px" }}>
        <SearchBar 
          placeholder="Поиск компании..."
          onSearch={handleInlineSearch}
        />
      </div>

      {/* Результаты inline поиска */}
      {searchQuery.length >= 2 && (
        <div style={{ marginBottom: "20px" }}>
          {searchLoading ? (
            <div className={styles.loading}>Поиск...</div>
          ) : searchResults.length === 0 ? (
            <div className={styles.empty}>По запросу "{searchQuery}" ничего не найдено</div>
          ) : (
            <>
              <h3 style={{ marginBottom: "12px" }}>Результаты поиска ({searchResults.length})</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Компания</th>
                    <th>Отзывов</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((company) => (
                    <tr key={company.id} style={{ cursor: "pointer" }} onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setActiveTab("companies");
                      fetchCompanyReviews(company.name);
                    }}>
                      <td><strong>{company.name}</strong></td>
                      <td>{company.reviews_count ?? 0}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery("");
                            setSearchResults([]);
                            setActiveTab("companies");
                            fetchCompanyReviews(company.name);
                          }}
                          className={`${styles.actionBtn} ${styles.toggle}`}
                        >
                          Редактировать отзывы
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Вкладки - показываем только когда нет поиска */}
      {searchQuery.length < 2 && (
        <>
          <div style={{ display: "flex", gap: "0", marginBottom: "20px", borderBottom: "2px solid #eee" }}>
            <button
              onClick={() => { setActiveTab("requests"); setSelectedCompany(null); }}
              style={{
                padding: "12px 24px",
                border: "none",
                background: activeTab === "requests" ? "#4f46e5" : "transparent",
                color: activeTab === "requests" ? "#fff" : "#666",
                cursor: "pointer",
                fontWeight: 600,
                borderRadius: "8px 8px 0 0"
              }}
            >
              Заявки на модерацию
            </button>
            <button
              onClick={() => { setActiveTab("companies"); setSelectedCompany(null); }}
              style={{
                padding: "12px 24px",
                border: "none",
                background: activeTab === "companies" ? "#4f46e5" : "transparent",
                color: activeTab === "companies" ? "#fff" : "#666",
                cursor: "pointer",
                fontWeight: 600,
                borderRadius: "8px 8px 0 0"
              }}
            >
              Все компании и отзывы
            </button>
          </div>

      {/* ========== ЗАЯВКИ ========== */}
      {activeTab === "requests" && (
        <>
          <div className={styles.searchBox} style={{ marginBottom: "20px" }}>
            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ddd" }}
            >
              <option value="">Все</option>
              <option value="PENDING">На модерации</option>
              <option value="APPROVED">Опубликованные</option>
              <option value="REJECTED">Отклонённые</option>
            </select>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : requests.length === 0 ? (
            <div className={styles.empty}>Нет заявок</div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
              gap: "20px"
            }}>
              {requests.map((request) => (
                <div key={request.id}>
                  <ReviewCard 
                    review={{
                      id: request.id,
                      from_company: request.from_company,
                      target_company: request.target_company,
                      rating: request.rating,
                      comment: request.comment,
                      status: request.status,
                      admin_comment: request.admin_comment,
                      created_at: request.created_at,
                    }}
                    showStatus={true}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    {request.status === "PENDING" && (
                      <>
                        <button onClick={() => approveRequest(request.id)} className={`${styles.actionBtn} ${styles.approve}`}>
                          Одобрить
                        </button>
                        <button onClick={() => setRejectModal(request.id)} className={`${styles.actionBtn} ${styles.reject}`}>
                          Отклонить
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteRequest(request.id)} className={`${styles.actionBtn} ${styles.reject}`}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========== КОМПАНИИ И ОТЗЫВЫ ========== */}
      {activeTab === "companies" && !selectedCompany && (
        <>
          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : companies.length === 0 ? (
            <div className={styles.empty}>Нет компаний</div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Компания</th>
                    <th>Кол-во отзывов</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.min_review_id}>
                      <td><strong>{company.name}</strong></td>
                      <td>{company.reviews_count}</td>
                      <td>
                        <button
                          onClick={() => fetchCompanyReviews(company.name)}
                          className={`${styles.actionBtn} ${styles.toggle}`}
                        >
                          Редактировать отзывы
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
                {companiesPage > 1 && (
                  <button className={`${styles.actionBtn} ${styles.toggle}`} onClick={() => setCompaniesPage(companiesPage - 1)}>
                    ← Назад
                  </button>
                )}
                <span>Страница {companiesPage}</span>
                {companiesHasNext && (
                  <button className={`${styles.actionBtn} ${styles.toggle}`} onClick={() => setCompaniesPage(companiesPage + 1)}>
                    Вперёд →
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ========== ОТЗЫВЫ ВЫБРАННОЙ КОМПАНИИ ========== */}
      {activeTab === "companies" && selectedCompany && (
        <>
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCompany(null)}
              className={`${styles.actionBtn} ${styles.toggle}`}
            >
              ← Назад к списку
            </button>
            <h2 style={{ margin: 0, fontSize: "18px" }}>
              {selectedCompany} — {companyReviewsTotal} отзывов
            </h2>
            {companyReviews.length > 0 && (
              <button
                onClick={() => {
                  // Находим запись с min_review_id (базовая запись компании)
                  const baseReview = companyReviews.find(r => r.id === minReviewId) || companyReviews[0];
                  setEditCompanyModal({ ...baseReview });
                }}
                className={`${styles.actionBtn} ${styles.approve}`}
              >
                ✏️ Редактировать данные компании
              </button>
            )}
          </div>

          {/* Сортировка */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ marginRight: "8px", fontWeight: 500 }}>Сортировка:</label>
            <select
              value={reviewsSortOrder}
              onChange={(e) => setReviewsSortOrder(e.target.value as "newest" | "oldest")}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
            >
              <option value="newest">От новых к старым</option>
              <option value="oldest">От старых к новым</option>
            </select>
          </div>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : companyReviews.length === 0 ? (
            <div className={styles.empty}>Нет отзывов у этой компании</div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
              gap: "20px"
            }}>
              {sortedReviews.map((review) => (
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
                      <strong style={{ fontSize: "16px" }}>{review.subject}</strong>
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                        ID: {review.id} | {review.source || "—"} | {review.jurisdiction || "—"}
                      </div>
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>
                      {review.rating ? `⭐ ${review.rating}` : "—"}
                    </div>
                  </div>

                  <div style={{ fontSize: "13px" }}>
                    <strong>От:</strong> {review.reviewer || "—"}
                  </div>

                  {review.comment && (
                    <div style={{ 
                      fontSize: "14px", 
                      lineHeight: "1.5",
                      maxHeight: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      backgroundColor: "#f8f9fa",
                      padding: "8px",
                      borderRadius: "4px"
                    }}>
                      {review.comment}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "12px", color: "#666" }}>
                    <div>ИНН: {review.inn || "—"}</div>
                    <div>ОГРН: {review.ogrn || "—"}</div>
                    <div>Фискальный код: {review.fiscal_code || "—"}</div>
                    <div>Статус: {review.status || "—"}</div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                    <button
                      className={`${styles.actionBtn} ${styles.toggle}`}
                      onClick={() => setEditReviewModal({ ...review })}
                      style={{ flex: 1 }}
                    >
                      Редактировать
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
        </>
      )}

      {/* Модальное окно отклонения заявки */}
      {rejectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Причина отклонения</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Укажите причину отклонения..."
              rows={4}
              style={{ width: "100%", padding: "10px", marginBottom: "16px" }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setRejectModal(null)} className={styles.btnCancel}>Отмена</button>
              <button onClick={rejectRequest} className={styles.btnReject}>Отклонить</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования отзыва - ТОЛЬКО ПОЛЯ ОТЗЫВА */}
      {editReviewModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: "600px" }}>
            <h3 style={{ marginBottom: "16px" }}>Редактировать отзыв #{editReviewModal.id}</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
              Компания: <strong>{editReviewModal.subject}</strong>
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Рейтинг (1-5)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={editReviewModal.rating || ""} 
                  onChange={(e) => updateReviewField("rating", Number(e.target.value) || null)} 
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Автор отзыва (от кого)</label>
                <input 
                  type="text" 
                  value={editReviewModal.reviewer || ""} 
                  onChange={(e) => updateReviewField("reviewer", e.target.value)} 
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Источник</label>
                <input 
                  type="text" 
                  value={editReviewModal.source || ""} 
                  onChange={(e) => updateReviewField("source", e.target.value)} 
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Дата отзыва</label>
                <input 
                  type="date" 
                  value={editReviewModal.review_date ? editReviewModal.review_date.split('T')[0] : ""} 
                  onChange={(e) => updateReviewField("review_date", e.target.value)} 
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Текст отзыва</label>
              <textarea 
                value={editReviewModal.comment || ""} 
                onChange={(e) => updateReviewField("comment", e.target.value)} 
                rows={6} 
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} 
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className={`${styles.actionBtn} ${styles.toggle}`} onClick={() => setEditReviewModal(null)}>
                Отмена
              </button>
              <button className={`${styles.actionBtn} ${styles.approve}`} onClick={saveReview}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования ДАННЫХ КОМПАНИИ - ВСЕ ПОЛЯ */}
      {editCompanyModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: "1000px", maxHeight: "90vh", overflow: "auto" }}>
            <h3 style={{ marginBottom: "16px" }}>Редактировать данные компании</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
              Изменения применятся к записи #{editCompanyModal.id}
            </p>
            
            {/* Основная информация */}
            <details open style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Основная информация
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Название компании</label>
                  <input type="text" value={editCompanyModal.subject || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, subject: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Сокращённое название</label>
                  <input type="text" value={editCompanyModal.short_name || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, short_name: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Статус компании</label>
                  <input type="text" value={editCompanyModal.status || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, status: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Регистрация */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Регистрация
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Юрисдикция</label>
                  <input type="text" value={editCompanyModal.jurisdiction || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, jurisdiction: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Страна</label>
                  <input type="text" value={editCompanyModal.country || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, country: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Орг-правовая форма</label>
                  <input type="text" value={editCompanyModal.legal_form || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, legal_form: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Регистрационный номер</label>
                  <input type="text" value={editCompanyModal.registration_number || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, registration_number: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Дата регистрации</label>
                  <input type="text" value={editCompanyModal.registration_date || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, registration_date: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>ИНН</label>
                  <input type="text" value={editCompanyModal.inn || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, inn: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>ОГРН</label>
                  <input type="text" value={editCompanyModal.ogrn || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, ogrn: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Номер компании</label>
                  <input type="text" value={editCompanyModal.company_number || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, company_number: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Фискальный код</label>
                  <input type="text" value={editCompanyModal.fiscal_code || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, fiscal_code: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CUIIO</label>
                  <input type="text" value={editCompanyModal.cuiio || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, cuiio: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CIN</label>
                  <input type="text" value={editCompanyModal.cin || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, cin: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Entity Type</label>
                  <input type="text" value={editCompanyModal.entity_type || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, entity_type: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Капитал */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Капитал и сотрудники
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Уставный капитал</label>
                  <input type="text" value={editCompanyModal.authorized_capital || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, authorized_capital: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Оплаченный капитал</label>
                  <input type="text" value={editCompanyModal.paid_up_capital || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, paid_up_capital: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Кол-во сотрудников</label>
                  <input type="text" value={editCompanyModal.employees_count || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, employees_count: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Деятельность */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Деятельность
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Вид деятельности</label>
                  <input type="text" value={editCompanyModal.activity_type || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, activity_type: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CAEM код</label>
                  <input type="text" value={editCompanyModal.caem_code || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, caem_code: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CAEM название</label>
                  <input type="text" value={editCompanyModal.caem_name || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, caem_name: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Адреса */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Адреса
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Юридический адрес</label>
                  <textarea value={editCompanyModal.legal_address || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, legal_address: e.target.value })} rows={2} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Почтовый адрес</label>
                  <textarea value={editCompanyModal.mailing_address || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, mailing_address: e.target.value })} rows={2} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Улица</label>
                  <input type="text" value={editCompanyModal.street_address || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, street_address: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Почтовый индекс</label>
                  <input type="text" value={editCompanyModal.postal_code || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, postal_code: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Контакты */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Контакты
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Email</label>
                  <input type="text" value={editCompanyModal.email || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, email: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Телефон</label>
                  <input type="text" value={editCompanyModal.phone || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, phone: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Сайт</label>
                  <input type="text" value={editCompanyModal.web || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, web: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Руководство */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Руководство
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Руководители</label>
                  <textarea value={editCompanyModal.managers || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, managers: e.target.value })} rows={3} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Бухгалтер</label>
                  <input type="text" value={editCompanyModal.accountant || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, accountant: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
            </details>

            {/* Статус */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Статус существования
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Дата ликвидации</label>
                  <input type="text" value={editCompanyModal.liquidation_date || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, liquidation_date: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600 }}>
                    <input type="checkbox" checked={editCompanyModal.liquidation || false} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, liquidation: e.target.checked })} />
                    Ликвидирована
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600 }}>
                    <input type="checkbox" checked={editCompanyModal.is_audited || false} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, is_audited: e.target.checked })} />
                    Аудирована
                  </label>
                </div>
              </div>
            </details>

            {/* Финансовые данные */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Финансовые данные
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Год отчёта</label>
                  <input type="number" value={editCompanyModal.report_year || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, report_year: Number(e.target.value) || null })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Тип отчёта</label>
                  <input type="text" value={editCompanyModal.report_type || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, report_type: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Статус отчёта</label>
                  <input type="text" value={editCompanyModal.report_status || ""} onChange={(e) => setEditCompanyModal({ ...editCompanyModal, report_status: e.target.value })} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>detail_data (JSON)</label>
                  <textarea 
                    value={editCompanyModal.detail_data ? JSON.stringify(editCompanyModal.detail_data, null, 2) : ""} 
                    onChange={(e) => {
                      try {
                        const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                        setEditCompanyModal({ ...editCompanyModal, detail_data: parsed });
                      } catch {
                        // Ignore parse errors while typing
                      }
                    }} 
                    rows={8} 
                    style={{ width: "100%", padding: "8px", fontFamily: "monospace", fontSize: "11px" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>detailed_data (JSON)</label>
                  <textarea 
                    value={editCompanyModal.detailed_data ? JSON.stringify(editCompanyModal.detailed_data, null, 2) : ""} 
                    onChange={(e) => {
                      try {
                        const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                        setEditCompanyModal({ ...editCompanyModal, detailed_data: parsed });
                      } catch {
                        // Ignore parse errors while typing
                      }
                    }} 
                    rows={8} 
                    style={{ width: "100%", padding: "8px", fontFamily: "monospace", fontSize: "11px" }} 
                  />
                </div>
              </div>
            </details>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px", position: "sticky", bottom: 0, backgroundColor: "#fff", padding: "16px 0", borderTop: "1px solid #eee" }}>
              <button className={`${styles.actionBtn} ${styles.toggle}`} onClick={() => setEditCompanyModal(null)}>
                Отмена
              </button>
              <button className={`${styles.actionBtn} ${styles.approve}`} onClick={saveCompanyData}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
