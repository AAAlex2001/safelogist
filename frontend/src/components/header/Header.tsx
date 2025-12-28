"use client";

import { useState, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import styles from "./Header.module.scss";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import LogoIcon from "@/icons/LogoIcon";

export default function Header() {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { isLoggedIn, userData } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.mainHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
          <Link href="/reviews" className={styles.logoLink} aria-label="SafeLogist">
            <div className={styles.logo}>
              <LogoIcon />
            </div>
          </Link>
        </div>

        <nav className={styles.headerNav} id="headerNav">
          <Link href="/reviews" className={styles.navLink}>
            {t('about')}
          </Link>
          <Link href="/reviews" className={styles.navLink}>
            {t('features')}
          </Link>
          <Link href="/reviews" className={styles.navLink}>
            {t('pricing')}
          </Link>
          <Link href="/reviews" className={styles.navLink}>
            {t('contacts')}
          </Link>
        </nav>

        {isLoggedIn ? (
          <div className={styles.headerRight}>
            <nav className={styles.userNav}>
              <Link href="/reviews-profile" className={styles.userNavLink}>
                Мои отзывы
              </Link>
              <Link href="/favorites" className={styles.userNavLink}>
                Избранное
              </Link>
              <Link href="/profile" className={styles.userNavLink}>
                Профиль
              </Link>
              <Link href="/pricing" className={styles.userNavLink}>
                Тарифы и оплата
              </Link>
            </nav>
          </div>
        ) : (
          <div className={styles.headerRight}>
            <Link href="/login" className={styles.btnLogin}>
              {t('login')}
            </Link>
            <Link href="/registration" className={styles.btnRegister}>
              {t('register')}
            </Link>
          </div>
        )}

        <button
          ref={burgerRef}
          className={`${styles.burgerMenu} ${menuOpen ? styles.active : ""}`}
          aria-label={t('menu')}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
  </>
  );
}
