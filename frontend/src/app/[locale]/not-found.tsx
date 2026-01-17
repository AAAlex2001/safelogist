import { getTranslations } from "next-intl/server";
import styles from "./not-found/not-found.module.scss";
import NotFoundClientActions from "./not-found/NotFoundClientActions";
import NotFoundFooter from "./not-found/NotFoundFooter";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className={styles.notFoundPage}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.description}>{t("description")}</p>

        <NotFoundClientActions
          searchPlaceholder={t("description")}
          buttonText={t("buttonText")}
        />
      </div>

      <NotFoundFooter />
    </div>
  );
}
