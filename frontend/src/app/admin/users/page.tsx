"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.scss";
import { Pagination } from "../components/Pagination";

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

type PaginatedResponse = {
  items: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = (searchQuery = "", pageNum = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "20",
    });
    
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    const url = `${API_URL}/api/admin/users?${params.toString()}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: PaginatedResponse) => {
        setUsers(data.items || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setPages(data.pages || 1);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
        setTotal(0);
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
        <>
          <div className={styles.statsBar}>
            Total users: {total} | Page {page} of {pages}
          </div>
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
          
          {pages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pages}
              onPageChange={(newPage) => fetchUsers(search, newPage)}
            />
          )}
        </>
      )}
    </div>
  );
}
