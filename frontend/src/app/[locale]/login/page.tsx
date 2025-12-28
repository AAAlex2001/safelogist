"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./login.module.scss";
import { InputField } from "@/components/input/InputField";
import { Button } from "@/components/button/Button";
import { ErrorNotification } from "@/components/notifications/ErrorNotification";
import { useLogin } from "./store/useLogin";
import { FormEvent } from "react";
import LogoIcon from "@/icons/LogoIcon";

export default function LoginPage() {
  const t = useTranslations("Login");
  const {
    state,
    login,
    setEmail,
    setPassword,
    setError,
  } = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <LogoIcon />
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          {state.error ? (
            <ErrorNotification
              message={state.error}
              duration={5000}
              onClose={() => setError(null)}
            />
          ) : null}
          <p className={styles.title}>{t("title")}</p>

          <div className={styles.card}>
            <InputField
              label={t("email")}
              placeholder={t("emailPlaceholder")}
              type="email"
              name="email"
              value={state.form.email}
              onChange={setEmail}
              error={state.fieldErrors.email}
              disabled={state.loading}
            />
            <InputField
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              type="password"
              name="password"
              value={state.form.password}
              onChange={setPassword}
              error={state.fieldErrors.password}
              disabled={state.loading}
            />
            <Link href="/forgot-password" className={styles.forgot}>
              {t("forgotPassword")}
            </Link>
          </div>

          <div className={styles.actions}>
            <Button type="submit" fullWidth disabled={state.loading} loading={state.loading}>
              {t("loginButton")}
            </Button>
            <div className={styles.secondaryLink}>
              {t("noAccount")} <a href="/register">{t("registerLink")}</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

