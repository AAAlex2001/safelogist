"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import ruMessages from "../../../messages/ru.json";
import "../globals.css";
import styles from "./admin.module.scss";
import AdminAuth from "./AdminAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/claims", label: "Claims" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/landing", label: "Landing" },
  ];

  return (
    <AdminAuth>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>SafeLogist Admin</div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <NextIntlClientProvider messages={ruMessages as any} locale="ru">
          {children}
        </NextIntlClientProvider>
      </main>
    </AdminAuth>
  );
}
