"use client";

import styles from "./forgot-password.module.scss";
import { InputField } from "@/components/input/InputField";
import { Button } from "@/components/button/Button";
import { ErrorNotification } from "@/components/notifications/ErrorNotification";
import { SuccessNotification } from "@/components/notifications/SuccessNotification";
import { useForgotPassword } from "./store/useForgotPassword";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import LogoIcon from "@/icons/LogoIcon";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");

  const {
    state,
    requestCode,
    verifyCode,
    resetPassword,
    goBackToEmail,
    setEmail,
    setCode,
    setPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirm,
    setError,
    setSuccess,
  } = useForgotPassword();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.step === "email") {
      await requestCode();
    } else if (state.step === "code") {
      await verifyCode();
    } else {
      await resetPassword();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <LogoIcon />
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          {state.error ? (
            <ErrorNotification
              message={state.error}
              duration={5000}
              onClose={() => setError(null)}
            />
          ) : null}
          {state.success ? (
            <SuccessNotification
              message={state.success}
              duration={5000}
              onClose={() => setSuccess(null)}
            />
          ) : null}

          {state.step === "email" ? (
            <>
              <h1 className={styles.title}>{t('title')}</h1>
              <div className={styles.inputBlock}>
                <p className={styles.subtitle}>{t('subtitleEmail')}</p>

                <div className={styles.field}>
                  <InputField
                    label=""
                    placeholder={t('emailPlaceholder')}
                    type="email"
                    name="email"
                    value={state.form.email}
                    onChange={setEmail}
                    error={state.fieldErrors.email}
                    disabled={state.loading}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <Link href="/login" className={styles.back}>
                  {t('backButton')}
                </Link>
                <Button type="submit" disabled={state.loading} loading={state.loading}>
                  {t('resetButton')}
                </Button>
              </div>
            </>
          ) : state.step === "code" ? (
            <>
              <h1 className={styles.title}>{t('title')}</h1>
              <p className={styles.subtitle}>{t('subtitleCode')}</p>

              <div className={styles.field}>
                <div className={styles.codeInputWrapper}>
                  <InputField
                    label=""
                    placeholder={t('codePlaceholder')}
                    type="password"
                    name="code"
                    value={state.form.code}
                    onChange={setCode}
                    error={state.fieldErrors.code}
                    disabled={state.loading}
                  />
                </div>
                <div className={styles.codeHint}>
                  {t('codeHint')}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.back} ${styles.backLink}`}
                  onClick={goBackToEmail}
                >
                  {t('backButton')}
                </button>
                <Button type="submit" disabled={state.loading} loading={state.loading}>
                  {t('sendCodeButton')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className={styles.title}>{t('titleReset')}</h1>
              <p className={styles.subtitle}>
                {t('subtitleReset')}
              </p>

              <div className={styles.field}>
                <InputField
                  label=""
                  placeholder={t('passwordPlaceholder')}
                  type="password"
                  name="password"
                  value={state.form.password}
                  onChange={setPassword}
                  error={state.fieldErrors.password}
                  disabled={state.loading}
                />

                <InputField
                  label=""
                  placeholder={t('passwordPlaceholder')}
                  type="password"
                  name="confirmPassword"
                  value={state.form.confirmPassword}
                  onChange={setConfirmPassword}
                  error={state.fieldErrors.confirm}
                  disabled={state.loading}
                />
              </div>

              <div className={styles.actionsSingle}>
                <Button type="submit" disabled={state.loading} loading={state.loading} fullWidth>
                  {t('saveButton')}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

