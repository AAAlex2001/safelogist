"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.scss";

type User = {
  id: number;
  email: string;
  phone: string;
  name: string | null;
  company_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = (searchQuery = "") => {
    setLoading(true);
    const url = searchQuery
      ? `${API_URL}/api/admin/users?search=${encodeURIComponent(searchQuery)}`
      : `${API_URL}/api/admin/users`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Убеждаемся, что это массив
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const toggleActive = async (userId: number) => {
    try {
      await fetch(`${API_URL}/api/admin/users/${userId}/toggle-active`, {
        method: "PATCH",
      });
      fetchUsers(search);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Users</h1>

      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by email, name, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : users.length === 0 ? (
        <div className={styles.empty}>No users found</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.name || "-"}</td>
                <td>{user.phone}</td>
                <td>{user.company_name || "-"}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      user.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <button
                    className={`${styles.actionBtn} ${styles.toggle}`}
                    onClick={() => toggleActive(user.id)}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
