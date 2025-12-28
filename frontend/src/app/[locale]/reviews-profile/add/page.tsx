"use client";

import React, { useState } from "react";
import { InputField } from "@/components/input/InputField";
import { TextareaField } from "@/components/input/TextareaField";
import { StarRating } from "@/components/input/StarRating";
import { Button } from "@/components/button/Button";
import Footer from "@/components/footer/Footer";
import CheckIcon from "@/icons/CheckIcon";
import styles from "./addReview.module.scss";

export default function AddReviewPage() {
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
          <div className={styles.txt}>Добавить отзыв</div>
        </div>
        <div className={styles.h2}>
          <div className={styles.txt}>
            Поделитесь своим опытом с другими пользователями
          </div>
        </div>
      </div>

      <div className={styles.addReview}>
        <div className={styles.infoInputs}>
          <div className={styles.reviewInput}>
            <div className={styles.inputReview}>
              {/* О ком ваш отзыв */}
              <InputField
                label="О ком ваш отзыв? *"
                placeholder="Название компании или ФИО"
                value={companyName}
                onChange={setCompanyName}
              />

              {/* Оценка сотрудничества */}
              <StarRating
                label="Оценка сотрудничества *"
                value={rating}
                onChange={setRating}
              />

              {/* Расскажите о вашем опыте */}
              <TextareaField
                label="Расскажите о вашем опыте *"
                placeholder="Как всё прошло? Что понравилось, а что нет? Дайте совет другим клиентам."
                value={reviewText}
                onChange={setReviewText}
                rows={3}
              />
            </div>

            {/* Прикрепите документ */}
            <div className={styles.documentSection}>
              <div className={styles.fileUpload}>
                <label className={styles.label}>Прикрепите документ *</label>
                <div className={styles.fileInputWrapper}>
                  <Button variant="outline" fullWidth as="label">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    {document ? document.name : "Выбрать файл"}
                  </Button>
                  <div className={styles.fileInfo}>
                    Поддерживаемые форматы: PDF, JPG, PNG (до 10 МБ)
                  </div>
                </div>
              </div>

              {/* Информация о документах */}
              <div className={styles.inputField}>
                <div className={styles.h3}>
                  Чтобы оставить отзыв, прикрепите один из документов:
                </div>
                <div className={styles.list}>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>CMR</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>Договор</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>
                      Акт выполненных работ
                    </div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>Товарная накладная</div>
                  </div>
                  <div className={styles.listItem}>
                    <CheckIcon />
                    <div className={styles.listText}>
                      Другой документ, подтверждающий сотрудничество
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка отправки */}
          <Button fullWidth onClick={handleSubmit}>
            Отправить отзыв
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
