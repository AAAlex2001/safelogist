"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.scss";

type Claim = {
  id: number;
  user_id: number;
  company_name: string;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  phone: string;
  email: string;
  position: string;
  document_path: string;
  status: "pending" | "approved" | "rejected";
  reject_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [rejectModal, setRejectModal] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchClaims = () => {
    setLoading(true);
    const url = filter
      ? `${API_URL}/api/claims?status=${filter}`
      : `${API_URL}/api/claims`;

    fetch(url)
      .then((res) => res.json())
      .then(setClaims)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClaims();
  }, [filter]);

  const approveClaim = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/claims/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      fetchClaims();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectClaim = async () => {
    if (!rejectModal) return;
    try {
      await fetch(`${API_URL}/api/claims/${rejectModal}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", reject_reason: rejectReason }),
      });
      setRejectModal(null);
      setRejectReason("");
      fetchClaims();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  };

  const getFullName = (claim: Claim) => {
    return [claim.last_name, claim.first_name, claim.middle_name]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Company Claims</h1>

      <div className={styles.searchBox}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #ddd" }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : claims.length === 0 ? (
        <div className={styles.empty}>No claims found</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Name</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Document</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.company_name}</td>
                <td>{getFullName(claim)}</td>
                <td>{claim.position}</td>
                <td>
                  <div>{claim.phone}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{claim.email}</div>
                </td>
                <td>
                  <a
                    href={`${API_URL}/${claim.document_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#012af9" }}
                  >
                    View
                  </a>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[claim.status]}`}>
                    {claim.status}
                  </span>
                </td>
                <td>{formatDate(claim.created_at)}</td>
                <td>
                  {claim.status === "pending" && (
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.approve}`}
                        onClick={() => approveClaim(claim.id)}
                      >
                        Approve
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.reject}`}
                        onClick={() => setRejectModal(claim.id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rejectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Reject Claim</h3>
            <textarea
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button
                className={`${styles.actionBtn} ${styles.toggle}`}
                onClick={() => setRejectModal(null)}
              >
                Cancel
              </button>
              <button
                className={`${styles.actionBtn} ${styles.reject}`}
                onClick={rejectClaim}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
