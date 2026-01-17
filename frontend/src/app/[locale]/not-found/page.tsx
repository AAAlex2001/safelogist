import { getTranslations } from "next-intl/server";
import styles from "./not-found.module.scss";
import NotFoundClientActions from "./NotFoundClientActions";
import NotFoundFooter from "./NotFoundFooter";

export default async function NotFoundPage() {
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

