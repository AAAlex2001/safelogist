"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { InputField } from "@/components/input/InputField";
import { TextareaField } from "@/components/input/TextareaField";
import { StarRating } from "@/components/input/StarRating";
import { Button } from "@/components/button/Button";
import Footer from "@/components/footer/Footer";
import CheckIcon from "@/icons/CheckIcon";
import styles from "./addReview.module.scss";

export default function AddReviewPage() {
  const t = useTranslations("AddReview");
  const [companyName, setCompanyName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log({ companyName, rating, reviewText, document });
  };

  return (
    <div className={styles.review}>
      <div className={styles.headings}>
        <div className={styles.h1}>
          <div className={styles.txt}>{t("pageTitle")}</div>
        </div>
        <div className={styles.h2}>
          <div className={styles.txt}>{t("pageSubtitle")}</div>
        </div>
      </div>

      <div className={styles.addReview}>
        <div className={styles.infoInputs}>
          <div className={styles.reviewInput}>
            <div className={styles.inputReview}>
              {/* О ком ваш отзыв */}
              <InputField
                label={t("companyLabel")}
                placeholder={t("companyPlaceholder")}
                value={companyName}
                onChange={setCompanyName}
              />

              {/* Оценка сотрудничества */}
              <StarRating
                label={t("ratingLabel")}
                value={rating}
                onChange={setRating}
              />

              {/* Расскажите о вашем опыте */}
              <TextareaField
                label={t("experienceLabel")}
                placeholder={t("experiencePlaceholder")}
                value={reviewText}
                onChange={setReviewText}
                rows={3}
              />
            </div>

            {/* Прикрепите документ */}
            <div className={styles.documentSection}>
              <div className={styles.fileUpload}>
                <label className={styles.label}>{t("documentLabel")}</label>
                <div className={styles.fileInputWrapper}>
                  <Button variant="outline" fullWidth as="label">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    {document ? document.name : t("selectFile")}
                  </Button>
                  <div className={styles.fileInfo}>{t("fileFormats")}</div>
                </div>
              </div>

              {/* Информация о документах */}
              <div className={styles.inputField}>
                <div className={styles.h3}>{t("documentHint")}</div>
                <div className={styles.list}>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>{t("docCMR")}</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>{t("docContract")}</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>{t("docAct")}</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>{t("docInvoice")}</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>{t("docOther")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка отправки */}
          <Button fullWidth onClick={handleSubmit}>
            {t("submitButton")}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
