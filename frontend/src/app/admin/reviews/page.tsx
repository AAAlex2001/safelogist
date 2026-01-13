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
  const [companiesSearch, setCompaniesSearch] = useState("");
  
  // Отзывы компании (для редактирования)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyReviews, setCompanyReviews] = useState<Review[]>([]);
  const [companyReviewsTotal, setCompanyReviewsTotal] = useState(0);
  const [editReviewModal, setEditReviewModal] = useState<Review | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    } else {
      fetchCompanies();
    }
  }, [activeTab, requestFilter, companiesPage]);

  // Поиск компаний с debounce
  useEffect(() => {
    if (activeTab === "companies") {
      const timer = setTimeout(() => {
        setCompaniesPage(1);
        fetchCompanies();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [companiesSearch]);

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
      let url = `${API_URL}/api/admin/companies?page=${companiesPage}&per_page=20`;
      if (companiesSearch) {
        url += `&search=${encodeURIComponent(companiesSearch)}`;
      }
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
    } catch (err) {
      console.error("Error fetching company reviews:", err);
      setCompanyReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const saveReview = async () => {
    if (!editReviewModal) return;
    try {
      await fetch(`${API_URL}/api/admin/reviews/${editReviewModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editReviewModal),
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

      <div style={{ marginBottom: "20px" }}>
        <SearchBar reviewsBasePath="/admin/company" />
      </div>

      {/* Вкладки */}
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
          {/* Поиск по компаниям */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Поиск компании по названию..."
              value={companiesSearch}
              onChange={(e) => setCompaniesSearch(e.target.value)}
              style={{ 
                padding: "12px 16px", 
                width: "100%", 
                maxWidth: "400px",
                borderRadius: "6px", 
                border: "1px solid #ddd",
                fontSize: "14px"
              }}
            />
          </div>

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
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSelectedCompany(null)}
              className={`${styles.actionBtn} ${styles.toggle}`}
            >
              ← Назад к списку
            </button>
            <h2 style={{ margin: 0, fontSize: "18px" }}>
              {selectedCompany} — {companyReviewsTotal} отзывов
            </h2>
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
              {companyReviews.map((review) => (
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

      {/* Модальное окно редактирования отзыва - ВСЕ ПОЛЯ */}
      {editReviewModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: "1000px", maxHeight: "90vh", overflow: "auto" }}>
            <h3 style={{ marginBottom: "16px" }}>Редактировать отзыв #{editReviewModal.id}</h3>
            
            {/* Основная информация */}
            <details open style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Основная информация
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Название компании (subject)</label>
                  <input type="text" value={editReviewModal.subject || ""} onChange={(e) => updateReviewField("subject", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Сокращённое название</label>
                  <input type="text" value={editReviewModal.short_name || ""} onChange={(e) => updateReviewField("short_name", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Источник</label>
                  <input type="text" value={editReviewModal.source || ""} onChange={(e) => updateReviewField("source", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Рейтинг</label>
                  <input type="number" min="1" max="5" value={editReviewModal.rating || ""} onChange={(e) => updateReviewField("rating", Number(e.target.value) || null)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Автор отзыва</label>
                  <input type="text" value={editReviewModal.reviewer || ""} onChange={(e) => updateReviewField("reviewer", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Статус компании</label>
                  <input type="text" value={editReviewModal.status || ""} onChange={(e) => updateReviewField("status", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <input type="text" value={editReviewModal.jurisdiction || ""} onChange={(e) => updateReviewField("jurisdiction", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Страна</label>
                  <input type="text" value={editReviewModal.country || ""} onChange={(e) => updateReviewField("country", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Орг-правовая форма</label>
                  <input type="text" value={editReviewModal.legal_form || ""} onChange={(e) => updateReviewField("legal_form", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Регистрационный номер</label>
                  <input type="text" value={editReviewModal.registration_number || ""} onChange={(e) => updateReviewField("registration_number", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Дата регистрации</label>
                  <input type="text" value={editReviewModal.registration_date || ""} onChange={(e) => updateReviewField("registration_date", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>ИНН</label>
                  <input type="text" value={editReviewModal.inn || ""} onChange={(e) => updateReviewField("inn", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>ОГРН</label>
                  <input type="text" value={editReviewModal.ogrn || ""} onChange={(e) => updateReviewField("ogrn", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Номер компании</label>
                  <input type="text" value={editReviewModal.company_number || ""} onChange={(e) => updateReviewField("company_number", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Фискальный код</label>
                  <input type="text" value={editReviewModal.fiscal_code || ""} onChange={(e) => updateReviewField("fiscal_code", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CUIIO</label>
                  <input type="text" value={editReviewModal.cuiio || ""} onChange={(e) => updateReviewField("cuiio", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CIN</label>
                  <input type="text" value={editReviewModal.cin || ""} onChange={(e) => updateReviewField("cin", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Entity Type</label>
                  <input type="text" value={editReviewModal.entity_type || ""} onChange={(e) => updateReviewField("entity_type", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <input type="text" value={editReviewModal.authorized_capital || ""} onChange={(e) => updateReviewField("authorized_capital", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Оплаченный капитал</label>
                  <input type="text" value={editReviewModal.paid_up_capital || ""} onChange={(e) => updateReviewField("paid_up_capital", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Кол-во сотрудников</label>
                  <input type="text" value={editReviewModal.employees_count || ""} onChange={(e) => updateReviewField("employees_count", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>employees_abs</label>
                  <input type="text" value={editReviewModal.employees_abs || ""} onChange={(e) => updateReviewField("employees_abs", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <input type="text" value={editReviewModal.activity_type || ""} onChange={(e) => updateReviewField("activity_type", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Subtype</label>
                  <input type="text" value={editReviewModal.subtype || ""} onChange={(e) => updateReviewField("subtype", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CAEM код</label>
                  <input type="text" value={editReviewModal.caem_code || ""} onChange={(e) => updateReviewField("caem_code", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CAEM название</label>
                  <input type="text" value={editReviewModal.caem_name || ""} onChange={(e) => updateReviewField("caem_name", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CFOJ код</label>
                  <input type="text" value={editReviewModal.cfoj_code || ""} onChange={(e) => updateReviewField("cfoj_code", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CFOJ название</label>
                  <input type="text" value={editReviewModal.cfoj_name || ""} onChange={(e) => updateReviewField("cfoj_name", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CFP код</label>
                  <input type="text" value={editReviewModal.cfp_code || ""} onChange={(e) => updateReviewField("cfp_code", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CFP название</label>
                  <input type="text" value={editReviewModal.cfp_name || ""} onChange={(e) => updateReviewField("cfp_name", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Branch</label>
                  <input type="text" value={editReviewModal.branch || ""} onChange={(e) => updateReviewField("branch", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <textarea value={editReviewModal.legal_address || ""} onChange={(e) => updateReviewField("legal_address", e.target.value)} rows={2} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Почтовый адрес</label>
                  <textarea value={editReviewModal.mailing_address || ""} onChange={(e) => updateReviewField("mailing_address", e.target.value)} rows={2} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Улица</label>
                  <input type="text" value={editReviewModal.street_address || ""} onChange={(e) => updateReviewField("street_address", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Почтовый индекс</label>
                  <input type="text" value={editReviewModal.postal_code || ""} onChange={(e) => updateReviewField("postal_code", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CUATM код</label>
                  <input type="text" value={editReviewModal.cuatm_code || ""} onChange={(e) => updateReviewField("cuatm_code", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>CUATM название</label>
                  <input type="text" value={editReviewModal.cuatm_name || ""} onChange={(e) => updateReviewField("cuatm_name", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <input type="text" value={editReviewModal.email || ""} onChange={(e) => updateReviewField("email", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Телефон</label>
                  <input type="text" value={editReviewModal.phone || ""} onChange={(e) => updateReviewField("phone", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Сайт</label>
                  <input type="text" value={editReviewModal.web || ""} onChange={(e) => updateReviewField("web", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <textarea value={editReviewModal.managers || ""} onChange={(e) => updateReviewField("managers", e.target.value)} rows={3} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Бухгалтер</label>
                  <input type="text" value={editReviewModal.accountant || ""} onChange={(e) => updateReviewField("accountant", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Телефон бухгалтера</label>
                  <input type="text" value={editReviewModal.accountant_phone || ""} onChange={(e) => updateReviewField("accountant_phone", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Ответственное лицо</label>
                  <input type="text" value={editReviewModal.responsible_person || ""} onChange={(e) => updateReviewField("responsible_person", e.target.value)} style={{ width: "100%", padding: "8px" }} />
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
                  <input type="text" value={editReviewModal.liquidation_date || ""} onChange={(e) => updateReviewField("liquidation_date", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600 }}>
                    <input type="checkbox" checked={editReviewModal.liquidation || false} onChange={(e) => updateReviewField("liquidation", e.target.checked)} />
                    Ликвидирована
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600 }}>
                    <input type="checkbox" checked={editReviewModal.is_audited || false} onChange={(e) => updateReviewField("is_audited", e.target.checked)} />
                    Аудирована
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600 }}>
                    <input type="checkbox" checked={editReviewModal.signed || false} onChange={(e) => updateReviewField("signed", e.target.checked)} />
                    Подписано
                  </label>
                </div>
              </div>
            </details>

            {/* Отзыв */}
            <details open style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Текст отзыва
              </summary>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Комментарий</label>
                <textarea value={editReviewModal.comment || ""} onChange={(e) => updateReviewField("comment", e.target.value)} rows={5} style={{ width: "100%", padding: "8px" }} />
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
                  <input type="number" value={editReviewModal.report_year || ""} onChange={(e) => updateReviewField("report_year", Number(e.target.value) || null)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Тип отчёта</label>
                  <input type="text" value={editReviewModal.report_type || ""} onChange={(e) => updateReviewField("report_type", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Статус отчёта</label>
                  <input type="text" value={editReviewModal.report_status || ""} onChange={(e) => updateReviewField("report_status", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Period From</label>
                  <input type="text" value={editReviewModal.period_from || ""} onChange={(e) => updateReviewField("period_from", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Period To</label>
                  <input type="text" value={editReviewModal.period_to || ""} onChange={(e) => updateReviewField("period_to", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Declaration Date</label>
                  <input type="text" value={editReviewModal.declaration_date || ""} onChange={(e) => updateReviewField("declaration_date", e.target.value)} style={{ width: "100%", padding: "8px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>detail_data (JSON)</label>
                  <textarea 
                    value={editReviewModal.detail_data ? JSON.stringify(editReviewModal.detail_data, null, 2) : ""} 
                    onChange={(e) => {
                      try {
                        const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                        updateReviewField("detail_data", parsed);
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
                    value={editReviewModal.detailed_data ? JSON.stringify(editReviewModal.detailed_data, null, 2) : ""} 
                    onChange={(e) => {
                      try {
                        const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                        updateReviewField("detailed_data", parsed);
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

            {/* Системные поля */}
            <details style={{ marginBottom: "16px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4f46e5", marginBottom: "12px" }}>
                Системные поля (только чтение)
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "12px", color: "#666" }}>
                <div>review_id: {editReviewModal.review_id}</div>
                <div>created_at: {editReviewModal.created_at}</div>
                <div>economic_agent_id: {editReviewModal.economic_agent_id || "—"}</div>
                <div>organization_id: {editReviewModal.organization_id || "—"}</div>
                <div>organization_name: {editReviewModal.organization_name || "—"}</div>
                <div>legal_entity_id: {editReviewModal.legal_entity_id || "—"}</div>
                <div>fisc: {editReviewModal.fisc || "—"}</div>
                <div>fiscal_date: {editReviewModal.fiscal_date || "—"}</div>
                <div>import_file_name: {editReviewModal.import_file_name || "—"}</div>
              </div>
            </details>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px", position: "sticky", bottom: 0, backgroundColor: "#fff", padding: "16px 0", borderTop: "1px solid #eee" }}>
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
    </div>
  );
}
