"use client";

import { useTranslations } from "next-intl";
import styles from "./not-found.module.scss";
import Footer from "@/components/footer/Footer";
import {SearchBar} from "@/components/SearchBar/SearchBar";
import {Button} from "@/components/button/Button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");
  const router = useRouter();
  const push = () => {
    router.push('/');
  }

  return (
    <div className={styles.notFoundPage}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.description}>{t("description")}</p>
        <SearchBar placeholder={t("description")} />
        <Button variant="outline" className={styles.button} onClick={push}>{t("buttonText")}</Button>
      </div>
      <Footer />
    </div>
  );
}

