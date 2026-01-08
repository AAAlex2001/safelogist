"use client";

import { useState, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import styles from "./Header.module.scss";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import LogoIcon from "@/icons/LogoIcon";
import SunIcon from "@/icons/SunIcon";
import GlobeIcon from "@/icons/GlobeIcon";
import RussiaFlag from "@/icons/flags/RussiaFlag";
import USAFlag from "@/icons/flags/USAFlag";
import RomaniaFlag from "@/icons/flags/RomaniaFlag";
import UkraineFlag from "@/icons/flags/UkraineFlag";
import SearchIcon from "@/icons/SearchIcon";
import NotificationIcon from "@/icons/NotificationIcon";
import SettingsIcon from "@/icons/SettingsIcon";
import UserIcon from "@/icons/UserIcon";
import DownIcon from "@/icons/DownIcon";
import { Button } from "@/components/button/Button";

const LANGS = ["ru", "en", "ro", "uk"] as const;
type Lang = (typeof LANGS)[number];

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLangPanel, setShowLangPanel] = useState(false);
  const [showRegionPanel, setShowRegionPanel] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<"СНГ" | "Европа">("СНГ");
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { isLoggedIn, userData } = useAuth();

  const currentLang = locale as Lang;

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  const handleLangChange = (lang: Lang) => {
    router.push(pathname, { locale: lang });
    setShowLangPanel(false);
  };

  const handleRegionChange = (region: "СНГ" | "Европа") => {
    setSelectedRegion(region);
    setShowRegionPanel(false);
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

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

          {!isLoggedIn && (
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
          )}

          {!isLoggedIn && (
            <div className={styles.headerControls}>
              <button
                className={styles.themeBtn}
                aria-label="Сменить тему"
                onClick={toggleTheme}
              >
                <SunIcon />
              </button>

              <div className={styles.langContainer}>
                <button
                  className={styles.langBtn}
                  aria-label="Сменить язык"
                  onClick={() => setShowLangPanel(!showLangPanel)}
                >
                  <GlobeIcon />
                  <span>{currentLang.toUpperCase()}</span>
                </button>

                {showLangPanel && (
                  <div className={styles.langDropdown}>
                    <button
                      className={styles.langOption}
                      onClick={() => handleLangChange("ru")}
                    >
                      <RussiaFlag />
                      <span>RU</span>
                    </button>
                    <button
                      className={styles.langOption}
                      onClick={() => handleLangChange("en")}
                    >
                      <USAFlag />
                      <span>EN</span>
                    </button>
                    <button
                      className={styles.langOption}
                      onClick={() => handleLangChange("ro")}
                    >
                      <RomaniaFlag />
                      <span>RO</span>
                    </button>
                    <button
                      className={styles.langOption}
                      onClick={() => handleLangChange("uk")}
                    >
                      <UkraineFlag />
                      <span>UK</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <div className={styles.headerRight}>
              <div className={styles.regionSelector}>
                <button
                  className={`${styles.regionButton} ${showRegionPanel ? styles.regionButtonOpen : ""}`}
                  onClick={() => setShowRegionPanel(!showRegionPanel)}
                >
                  <span>Регион поиска: {selectedRegion}</span>
                  <svg
                    className={`${styles.regionArrow} ${showRegionPanel ? styles.regionArrowOpen : ""}`}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M4.5 6.75L9 11.25L13.5 6.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showRegionPanel && (
                  <div className={styles.regionDropdown}>
                    <button 
                      className={styles.regionOption}
                      onClick={() => handleRegionChange(selectedRegion === "СНГ" ? "Европа" : "СНГ")}
                    >
                      Регион поиска: {selectedRegion === "СНГ" ? "Европа" : "СНГ"}
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.userIcons}>
                <button className={styles.iconButton} aria-label="Уведомления">
                  <NotificationIcon width={22} height={22} />
                </button>
                <button className={styles.iconButton} aria-label="Настройки">
                  <SettingsIcon width={22} height={22} />
                </button>
                <button className={styles.iconButton} aria-label="Профиль" onClick={openMenu}>
                  <UserIcon width={22} height={22} />
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.headerRight}>
              <Link href="/login">
                <Button variant="outline" className={styles.loginButton}>
                  {t('login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button className={styles.registerButton}>
                  {t('register')}
                </Button>
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
