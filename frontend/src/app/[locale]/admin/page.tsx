"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.scss";

type Stats = {
  total_users: number;
  active_users: number;
  pending_claims: number;
  approved_claims: number;
  pending_reviews: number;
  approved_reviews: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.total_users || 0}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.active_users || 0}</div>
          <div className={styles.statLabel}>Active Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.pending_claims || 0}</div>
          <div className={styles.statLabel}>Pending Claims</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.approved_claims || 0}</div>
          <div className={styles.statLabel}>Approved Claims</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.pending_reviews || 0}</div>
          <div className={styles.statLabel}>Pending Reviews</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.approved_reviews || 0}</div>
          <div className={styles.statLabel}>Approved Reviews</div>
        </div>
      </div>
    </div>
  );
}
