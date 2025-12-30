"use client";

import styles from "./register.module.scss";
import { InputField } from "@/components/input/InputField";
import { Button } from "@/components/button/Button";
import { ErrorNotification } from "@/components/notifications/ErrorNotification";
import { SuccessNotification } from "@/components/notifications/SuccessNotification";
import { useRegistration, UserRole } from "./store/useRegistration";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import LogoIcon from "@/icons/LogoIcon";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function RegisterPage() {
  const t = useTranslations("Registration");

  const {
    state,
    sendCode,
    verifyCode,
    register,
    goBackToForm,
    setName,
    setRole,
    setPhone,
    setEmail,
    setCode,
    setPassword,
    setConfirmPassword,
    setError,
    setSuccess,
  } = useRegistration();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.step === "form") {
      await sendCode();
    } else if (state.step === "code") {
      await verifyCode();
    } else {
      await register();
    }
  };

  const roleOptions = [
    { value: "TRANSPORT_COMPANY", label: t("roleTransport") },
    { value: "CARGO_OWNER", label: t("roleCargoOwner") },
    { value: "FORWARDER", label: t("roleForwarder") },
    { value: "USER", label: t("roleUser") },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <LogoIcon />
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {state.error && (
            <ErrorNotification
              message={state.error}
              duration={5000}
              onClose={() => setError(null)}
            />
          )}
          {state.success && (
            <SuccessNotification
              message={state.success}
              duration={5000}
              onClose={() => setSuccess(null)}
            />
          )}

          {state.step === "form" && (
            <>
              <h1 className={styles.title}>{t("title")}</h1>

              <div className={styles.field}>
                <InputField
                  label={t("nameLabel")}
                  placeholder={t("namePlaceholder")}
                  type="text"
                  name="name"
                  value={state.form.name}
                  onChange={setName}
                  error={state.fieldErrors.name}
                  disabled={state.loading}
                />

                <InputField
                  label={t("roleLabel")}
                  placeholder={t("rolePlaceholder")}
                  type="select"
                  name="role"
                  value={state.form.role}
                  onChange={(v) => setRole(v as UserRole)}
                  options={roleOptions}
                  error={state.fieldErrors.role}
                  disabled={state.loading}
                />

                <div className={styles.phoneWrapper}>
                  <span className={styles.phoneLabel}>{t("phoneLabel")}</span>
                  <div
                    className={`${styles.phoneInput} ${state.fieldErrors.phone ? styles.phoneInputError : ""}`}
                  >
                    <PhoneInput
                      country={"ru"}
                      value={state.form.phone}
                      onChange={setPhone}
                      placeholder={t("phonePlaceholder")}
                      disabled={state.loading}
                      enableSearch={true}
                      searchPlaceholder={t("searchCountry")}
                      preferredCountries={["ru", "ua", "md", "by", "kz"]}
                      disableDropdown={true}
                    />
                  </div>
                  {state.fieldErrors.phone && (
                    <span className={styles.phoneError}>{state.fieldErrors.phone}</span>
                  )}
                </div>

                <InputField
                  label={t("emailLabel")}
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  name="email"
                  value={state.form.email}
                  onChange={setEmail}
                  error={state.fieldErrors.email}
                  disabled={state.loading}
                />
              </div>

              <div className={styles.actions}>
                <Button type="submit" fullWidth disabled={state.loading} loading={state.loading}>
                  {t("continueButton")}
                </Button>
                <div className={styles.secondaryLink}>
                  {t("hasAccount")} <Link href="/login">{t("loginLink")}</Link>
                </div>
              </div>
            </>
          )}

          {state.step === "code" && (
            <>
              <h1 className={styles.title}>{t("titleCode")}</h1>
              <p className={styles.subtitle}>{t("subtitleCode")}</p>

              <div className={styles.field}>
                <InputField
                  label=""
                  placeholder={t("codePlaceholder")}
                  type="password"
                  name="code"
                  value={state.form.code}
                  onChange={setCode}
                  error={state.fieldErrors.code}
                  disabled={state.loading}
                />
                <div className={styles.codeHint}>{t("codeHint")}</div>
              </div>

              <div className={styles.actionsRow}>
                <button type="button" className={styles.back} onClick={goBackToForm}>
                  {t("backButton")}
                </button>
                <Button type="submit" disabled={state.loading} loading={state.loading}>
                  {t("sendCodeButton")}
                </Button>
              </div>
            </>
          )}

          {state.step === "password" && (
            <>
              <h1 className={styles.title}>{t("titlePassword")}</h1>
              <p className={styles.subtitle}>{t("subtitlePassword")}</p>

              <div className={styles.field}>
                <InputField
                  label={t("passwordLabel")}
                  placeholder={t("passwordPlaceholder")}
                  type="password"
                  name="password"
                  value={state.form.password}
                  onChange={setPassword}
                  error={state.fieldErrors.password}
                  disabled={state.loading}
                />

                <InputField
                  label={t("confirmPasswordLabel")}
                  placeholder={t("passwordPlaceholder")}
                  type="password"
                  name="confirmPassword"
                  value={state.form.confirmPassword}
                  onChange={setConfirmPassword}
                  error={state.fieldErrors.confirm}
                  disabled={state.loading}
                />
              </div>

              <div className={styles.actions}>
                <Button type="submit" fullWidth disabled={state.loading} loading={state.loading}>
                  {t("createAccountButton")}
                </Button>
                <p className={styles.termsText}>
                  {t("termsText")}{" "}
                  <Link href="/terms">{t("termsLink")}</Link>{" "}
                  {t("termsAnd")}{" "}
                  <Link href="/privacy">{t("privacyLink")}</Link>
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
