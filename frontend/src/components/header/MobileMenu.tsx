"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import styles from "./MobileMenu.module.scss";
import ReviewIcon from "@/icons/ReviewIcon";
import FavoriteIcon from "@/icons/FavoriteIcon";
import ProfileIcon from "@/icons/ProfileIcon";
import PaymentIcon from "@/icons/PaymentIcon";
import LogoutIcon from "@/icons/LogoutIcon";
import UserIcon from "@/icons/UserIcon";
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

            <Link href="/favorites" className={styles.menuTab} onClick={onClose}>
              <FavoriteIcon />
              <span>Избранное</span>
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
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 3V1M11 21V19M19 11H21M1 11H3M16.657 5.343L18.07 3.93M3.93 18.07L5.344 16.656M5.344 5.342L3.93 3.93M18.07 18.07L16.656 16.656M11 16C12.3261 16 13.5979 15.4732 14.5355 14.5355C15.4732 13.5979 16 12.3261 16 11C16 9.67392 15.4732 8.40215 14.5355 7.46447C13.5979 6.52678 12.3261 6 11 6C9.67392 6 8.40215 6.52678 7.46447 7.46447C6.52678 8.40215 6 9.67392 6 11C6 12.3261 6.52678 13.5979 7.46447 14.5355C8.40215 15.4732 9.67392 16 11 16Z"
              stroke="#4D4D4D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.66667 7.66667H20.3333M1.66667 14.3333H20.3333M1 11C1 12.3132 1.25866 13.6136 1.7612 14.8268C2.26375 16.0401 3.00035 17.1425 3.92893 18.0711C4.85752 18.9997 5.95991 19.7363 7.17317 20.2388C8.38642 20.7413 9.68678 21 11 21C12.3132 21 13.6136 20.7413 14.8268 20.2388C16.0401 19.7363 17.1425 18.9997 18.0711 18.0711C18.9997 17.1425 19.7363 16.0401 20.2388 14.8268C20.7413 13.6136 21 12.3132 21 11C21 8.34784 19.9464 5.8043 18.0711 3.92893C16.1957 2.05357 13.6522 1 11 1C8.34784 1 5.8043 2.05357 3.92893 3.92893C2.05357 5.8043 1 8.34784 1 11Z"
                stroke="#4D4D4D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.4423 1C8.5705 3.99957 7.57813 7.46429 7.57812 11C7.57813 14.5357 8.5705 18.0004 10.4423 21M11.5535 1C13.4253 3.99957 14.4177 7.46429 14.4177 11C14.4177 14.5357 13.4253 18.0004 11.5535 21"
                stroke="#4D4D4D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5" strokeWidth="0.5"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 13.3346H28V6.66797H0V13.3346Z" fill="#0C47B7"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 19.9987H28V13.332H0V19.9987Z" fill="#E53B35"/>
                </svg>
                <span>RU</span>
              </button>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("en");
                }}
              >
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect width="28" height="20" rx="2" fill="white"/>
                  <path d="M28 20H0V18.667H28V20ZM28 17.333H0V16H28V17.333ZM28 14.667H0V13.333H28V14.667ZM28 12H0V10.667H28V12ZM28 9.33301H0V8H28V9.33301ZM28 6.66699H0V5.33301H28V6.66699ZM28 4H0V2.66699H28V4ZM28 1.33301H0V0H28V1.33301Z" fill="#D02F44"/>
                  <rect width="12" height="9.33333" fill="#46467F"/>
                </svg>
                <span>EN</span>
              </button>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("ro");
                }}
              >
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect width="28" height="20" rx="2" fill="white"/>
                  <rect x="13.332" width="14.6667" height="20" fill="#E5253D"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 20H9.33333V0H0V20Z" fill="#0A3D9C"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.33203 20H18.6654V0H9.33203V20Z" fill="#FFD955"/>
                </svg>
                <span>RO</span>
              </button>
              <button
                className={styles.langOption}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLangChange("uk");
                }}
              >
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                  <rect width="28" height="20" rx="2" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 10.6667H28V0H0V10.6667Z" fill="#156DD1"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 20.0013H28V10.668H0V20.0013Z" fill="#FFD948"/>
                </svg>
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
        <Link href="/registration" onClick={onClose}>
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
