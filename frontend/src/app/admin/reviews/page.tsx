"use client";

import { useEffect, useState } from "react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("PENDING");
  const [rejectModal, setRejectModal] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchReviews = () => {
    setLoading(true);
    const url = filter
      ? `${API_URL}/api/admin/review-requests?status=${filter}`
      : `${API_URL}/api/admin/review-requests`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const approveReview = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/admin/review-requests/${id}/approve`, {
        method: "POST",
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectReview = async () => {
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
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Удалить эту заявку на отзыв?")) return;
    try {
      await fetch(`${API_URL}/api/admin/review-requests/${id}`, {
        method: "DELETE",
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Review Requests</h1>

      <div className={styles.searchBox}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ddd" }}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>No review requests found</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>From</th>
              <th>To</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td><strong>{review.from_company}</strong></td>
                <td><strong>{review.target_company}</strong></td>
                <td style={{ color: "#f59e0b", fontSize: "16px" }}>{renderStars(review.rating)}</td>
                <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {review.comment}
                </td>
                <td>
                  {review.attachment_path ? (
                    <a
                      href={`${API_URL}/${review.attachment_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#012af9" }}
                    >
                      {review.attachment_name || "View"}
                    </a>
                  ) : (
                    <span style={{ color: "#999" }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[review.status.toLowerCase()]}`}>
                    {review.status}
                  </span>
                </td>
                <td>{formatDate(review.created_at)}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {review.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => approveReview(review.id)}
                          className={styles.btnApprove}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setRejectModal(review.id)}
                          className={styles.btnReject}
                        >
                          ✗
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className={styles.btnDelete}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
              <button onClick={() => setRejectModal(null)} className={styles.btnCancel}>
                Cancel
              </button>
              <button onClick={rejectReview} className={styles.btnReject}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
