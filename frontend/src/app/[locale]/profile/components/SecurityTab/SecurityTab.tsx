"use client";

import { useTranslations } from "next-intl";
import styles from "./SecurityTab.module.scss";
import { useProfile } from "../../store";
import { Button } from "@/components/button/Button";

export function SecurityTab() {
  const t = useTranslations("Profile");
  const {
    state,
    setCurrentPassword,
    setNewPassword,
    setRepeatPassword,
    toggleShowNew,
    toggleShowRepeat,
    deleteAccount,
  } = useProfile();

  const { security, saving } = state;

  return (
    <>
      <div className={styles.securityCard}>
        <div className={styles.sectionTitle}>{t("passwordSection")}</div>
        <div className={styles.fieldGroup}>
          <div className={styles.passwordField}>
            <label className={styles.passwordLabel}>{t("currentPassword")}</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type="password"
                className={`${styles.passwordInput} ${security.errors.current ? styles.passwordInputError : ""}`}
                placeholder={t("passwordPlaceholder")}
                value={security.currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            {security.errors.current && (
              <span className={styles.errorText}>{security.errors.current}</span>
            )}
          </div>

          <div className={styles.passwordField}>
            <label className={styles.passwordLabel}>{t("newPassword")}</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={security.showNew ? "text" : "password"}
                className={`${styles.passwordInput} ${security.errors.new ? styles.passwordInputError : ""}`}
                placeholder={t("passwordPlaceholder")}
                value={security.newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={toggleShowNew}
                aria-label={security.showNew ? t("hidePassword") : t("showPassword")}
              >
                {security.showNew ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            {security.errors.new && (
              <span className={styles.errorText}>{security.errors.new}</span>
            )}
          </div>

          <div className={styles.passwordField}>
            <label className={styles.passwordLabel}>{t("repeatPassword")}</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={security.showRepeat ? "text" : "password"}
                className={`${styles.passwordInput} ${security.errors.repeat ? styles.passwordInputError : ""}`}
                placeholder={t("passwordPlaceholder")}
                value={security.repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={toggleShowRepeat}
                aria-label={security.showRepeat ? t("hidePassword") : t("showPassword")}
              >
                {security.showRepeat ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            {security.errors.repeat && (
              <span className={styles.errorText}>{security.errors.repeat}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.accountCard}>
        <div className={styles.accountContent}>
          <div className={styles.deleteSection}>
            <div className={styles.deleteTitle}>{t("accountActions")}</div>
            <div className={styles.deleteHint}>
              {t("deleteAccountHint")}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={deleteAccount}
            disabled={saving}
          >
            {t("deleteAccount")}
          </Button>
        </div>
      </div>
    </>
  );
}

function EyeOpenIcon() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.9974 5.99007C12.9974 7.57892 11.653 8.86693 9.99457 8.86693C8.33617 8.86693 6.99177 7.57892 6.99177 5.99007C6.99177 4.4012 8.33617 3.1132 9.99457 3.1132C11.653 3.11318 12.9974 4.40122 12.9974 5.99007ZM10 0C8.28292 0.00761667 6.5031 0.425633 4.81827 1.22595C3.5673 1.84465 2.34817 2.71755 1.2899 3.79497C0.770133 4.34495 0.107183 5.14132 0 5.991C0.0126667 6.72702 0.802167 7.63548 1.2899 8.18705C2.28228 9.22215 3.46967 10.0707 4.81827 10.7567C6.38945 11.5192 8.12853 11.9582 10 11.9826C11.7187 11.9749 13.4981 11.5521 15.1811 10.7567C16.4321 10.138 17.6518 9.26447 18.7101 8.18705C19.2299 7.63707 19.8928 6.84068 20 5.991C19.9873 5.25498 19.1978 4.34648 18.7101 3.79493C17.7177 2.75983 16.5297 1.91195 15.1811 1.22592C13.6107 0.463983 11.8674 0.0279833 10 0ZM9.99873 1.48747C12.6007 1.48747 14.71 3.50403 14.71 5.99165C14.71 8.47927 12.6007 10.4958 9.99873 10.4958C7.39675 10.4958 5.28748 8.47923 5.28748 5.99165C5.28748 3.50403 7.39675 1.48747 9.99873 1.48747Z" fill="#959595"/>
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.521 0.292786C18.3335 0.105315 18.0792 0 17.814 0C17.5488 0 17.2945 0.105315 17.107 0.292786L1.48 15.9218C1.38449 16.014 1.30831 16.1244 1.2559 16.2464C1.20349 16.3684 1.1759 16.4996 1.17475 16.6324C1.1736 16.7652 1.1989 16.8968 1.24918 17.0197C1.29946 17.1426 1.37371 17.2543 1.4676 17.3482C1.5615 17.4421 1.67315 17.5163 1.79605 17.5666C1.91894 17.6169 2.05062 17.6422 2.1834 17.641C2.31618 17.6399 2.4474 17.6123 2.5694 17.5599C2.69141 17.5075 2.80175 17.4313 2.894 17.3358L18.52 1.70679C18.7075 1.51926 18.8128 1.26495 18.8128 0.999786C18.8128 0.734622 18.7085 0.480314 18.521 0.292786ZM3.108 12.3128L5.668 9.75279C5.59517 9.44536 5.55727 9.13071 5.555 8.81479C5.555 6.43579 7.545 4.50579 10 4.50579C10.286 4.50579 10.564 4.53779 10.835 4.58779L12.038 3.38579C11.3642 3.27569 10.6827 3.21885 10 3.21579C3.44 3.21479 0 8.04579 0 8.81479C0 9.23779 1.057 10.9058 3.108 12.3128ZM16.895 5.31979L14.333 7.87979C14.402 8.18179 14.444 8.49279 14.444 8.81479C14.444 11.1938 12.455 13.1218 10 13.1218C9.716 13.1218 9.44 13.0898 9.171 13.0408L7.967 14.2438C8.609 14.3478 9.283 14.4138 10 14.4138C16.56 14.4138 20 9.58079 20 8.81479C20 8.39079 18.944 6.72479 16.895 5.31979Z" fill="#959595"/>
    </svg>
  );
}
