"use client";

import { useTranslations } from "next-intl";
import styles from "./SecurityTab.module.scss";
import { useProfile } from "../../store";
import { Button } from "@/components/button/Button";
import { InputField } from "@/components/input/InputField";

export function SecurityTab() {
  const t = useTranslations("Profile");
  const {
    state,
    setCurrentPassword,
    setNewPassword,
    setRepeatPassword,
    deleteAccount,
  } = useProfile();

  const { security, saving } = state;

  return (
    <>
      <div className={styles.securityCard}>
        <div className={styles.sectionTitle}>{t("passwordSection")}</div>
        <div className={styles.fieldGroup}>
          <InputField
            type="password"
            label={t("currentPassword")}
            placeholder={t("passwordPlaceholder")}
            value={security.currentPassword}
            onChange={setCurrentPassword}
            error={security.errors.current}
            variant="white"
          />

          <InputField
            type="password"
            label={t("newPassword")}
            placeholder={t("passwordPlaceholder")}
            value={security.newPassword}
            onChange={setNewPassword}
            error={security.errors.new}
            variant="white"
          />

          <InputField
            type="password"
            label={t("repeatPassword")}
            placeholder={t("passwordPlaceholder")}
            value={security.repeatPassword}
            onChange={setRepeatPassword}
            error={security.errors.repeat}
            variant="white"
          />
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
