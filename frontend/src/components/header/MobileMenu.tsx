"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import styles from "./MobileMenu.module.scss";
import ReviewIcon from "@/icons/ReviewIcon";
import SettingsIcon from "@/icons/SettingsIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import PaymentIcon from "@/icons/PaymentIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import UserIcon from "@/icons/UserIcon";
import SunIcon from "@/icons/SunIcon";
import GlobeIcon from "@/icons/GlobeIcon";
import RussiaFlag from "@/icons/flags/RussiaFlag";
import USAFlag from "@/icons/flags/USAFlag";
import RomaniaFlag from "@/icons/flags/RomaniaFlag";
import UkraineFlag from "@/icons/flags/UkraineFlag";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/button/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGS = ["ru", "en", "ro", "uk"] as const;
type Lang = (typeof LANGS)[number];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, userData, logout } = useAuth();
  
  const currentLang = locale as Lang;

  const [showLangPanel, setShowLangPanel] = useState(false);
  
  const requestsData = {
    plan: "Enterprise+",
    availableRequests: 234,
    totalRequests: 500
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClick = () => setShowLangPanel(false);
    if (showLangPanel) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showLangPanel]);

  const handleLangChange = (lang: Lang) => {
    router.push(pathname, { locale: lang });
    setShowLangPanel(false);
    onClose();
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <div
      ref={menuRef}
      className={`${styles.mobileMenu} ${isOpen ? styles.active : ""} ${isLoggedIn ? styles.loggedIn : ""}`}
    >
      {isLoggedIn ? (
        <>
          <div className={styles.profileSection}>
            <div className={styles.userInfo}>
              <div className={styles.avatarCircle}>
                {userData?.photo ? (
                  <img 
                    src={userData.photo} 
                    alt={userData.name}
                    className={styles.avatarPhoto}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{userData?.name || "User"}</div>
                <div className={styles.userEmail}>{userData?.email || ""}</div>
                <div className={styles.userPlan}>{requestsData.plan}</div>
              </div>
            </div>
          </div>

          <div className={styles.requestsStats}>
            <div className={styles.requestsHeader}>
              <span className={styles.requestsLabel}>{t('requestsAvailable')}</span>
              <span className={styles.requestsCount}>{requestsData.availableRequests} {t('of')} {requestsData.totalRequests}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(requestsData.availableRequests / requestsData.totalRequests) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.menuTabs}>
            <Link href="/reviews-profile" className={styles.menuTab} onClick={onClose}>
              <ReviewIcon />
              <span>Мои отзывы</span>
            </Link>

            <Link href="/settings" className={styles.menuTab} onClick={onClose}>
              <SettingsIcon />
              <span>Настройки</span>
            </Link>

            <Link href="/profile" className={styles.menuTab} onClick={onClose}>
              <ProfileIcon />
              <span>Профиль</span>
            </Link>

            <Link href="/pricing" className={styles.menuTab} onClick={onClose}>
              <PaymentIcon />
              <span>Тарифы и оплата</span>
            </Link>
          </div>

          <button className={styles.logoutButton} onClick={() => { logout(); onClose(); }}>
            <LogoutIcon />
            <span>Выйти</span>
          </button>
        </>
      ) : (
        <>
          <Link href="/reviews-profile/add" onClick={onClose}>
            <Button variant="outline" fullWidth>
              {t('leaveReview')}
            </Button>
          </Link>

      <Link href="/reviews" className={styles.navLink} onClick={onClose}>
        {t('about')}
      </Link>
      <Link href="/reviews" className={styles.navLink} onClick={onClose}>
        {t('features')}
      </Link>
      <Link href="/reviews" className={styles.navLink} onClick={onClose}>
        {t('pricing')}
      </Link>
      <Link href="/reviews" className={styles.navLink} onClick={onClose}>
        {t('contacts')}
      </Link>

      <div className={styles.themeLangContainer}>
        <button
          className={styles.themeBtn}
          aria-label="Сменить тему"
          onClick={toggleTheme}
        >
          <SunIcon />
        </button>

        <div className={styles.langContainer}>
          <button
            className={`${styles.langBtn} ${showLangPanel ? styles.hidden : ""}`}
            aria-label="Сменить язык"
            onClick={(e) => {
              e.stopPropagation();
              setShowLangPanel(true);
            }}
          >
            <GlobeIcon />
            <span>{currentLang.toUpperCase()}</span>
          </button>

          <div
            className={`${styles.langSelectorPanel} ${showLangPanel ? styles.active : ""}`}
          >
            <div className={styles.langSelectorContent}>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("ru");
                }}
              >
                <RussiaFlag />
                <span>RU</span>
              </button>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("en");
                }}
              >
                <USAFlag />
                <span>EN</span>
              </button>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("ro");
                }}
              >
                <RomaniaFlag />
                <span>RO</span>
              </button>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("uk");
                }}
              >
                <UkraineFlag />
                <span>UK</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <Link href="/login" onClick={onClose}>
          <Button variant="outline" fullWidth>
            {t('login')}
          </Button>
        </Link>
        <Link href="/register" onClick={onClose}>
          <Button fullWidth>
            {t('register')}
          </Button>
        </Link>
      </div>
        </>
      )}
    </div>
  );
}
