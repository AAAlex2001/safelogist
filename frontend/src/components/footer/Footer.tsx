"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import styles from "./Footer.module.scss";
import LogoIcon from "@/icons/LogoIcon";
import TelegramIcon from "@/icons/TelegramIcon";
import InstagramIcon from "@/icons/InstagramIcon";

export default function Footer() {
  const t = useTranslations("Footer");
  
  return (
    <footer className={styles.mainFooter}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogoSection}>
            <Link href="/reviews" className={styles.footerLogoLink}>
              <div className={styles.footerLogo}>
                <LogoIcon />
              </div>
            </Link>
            <p className={styles.footerDescription}>
              {t("description")}
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>{t("quickLinks")}</h3>
              <ul className={styles.footerList}>
                <li>
                  <Link href="/chat" className={styles.footerLink}>
                    {t("chatGrok")}
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className={styles.footerLink}>
                    {t("searchReviews")}
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className={styles.footerLink}>
                    {t("searchCompanies")}
                  </Link>
                </li>
                <li>
                  <Link href="/courts" className={styles.footerLink}>
                    {t("searchCourts")}
                  </Link>
                </li>
                <li>
                  <Link href="/persons" className={styles.footerLink}>
                    {t("searchPersons")}
                  </Link>
                </li>
                <li>
                  <Link href="/cif" className={styles.footerLink}>
                    {t("searchCIF")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>{t("documents")}</h3>
              <ul className={styles.footerList}>
                <li>
                  <Link href="/privacy" className={styles.footerLink}>
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={styles.footerLink}>
                    {t("termsOfUse")}
                  </Link>
                </li>
                <li>
                  <Link href="/personal-data" className={styles.footerLink}>
                    {t("personalDataPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/offer" className={styles.footerLink}>
                    {t("offerAgreement")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>{t("contacts")}</h3>
              <ul className={styles.footerList}>
                <li>
                  <a href="mailto:info@safelogist.net" className={styles.footerLink}>
                    info@safelogist.net
                  </a>
                </li>
              </ul>
              <div className={styles.footerSocial}>
                <a
                  href="https://t.me/safelogist"
                  className={styles.socialIcon}
                  aria-label="Telegram"
                >
                  <TelegramIcon size={35} />
                </a>
                <a
                  href="https://instagram.com/safelogist"
                  className={styles.socialIcon}
                  aria-label="Instagram"
                >
                  <InstagramIcon size={35} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}


