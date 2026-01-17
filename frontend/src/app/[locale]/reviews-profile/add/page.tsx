"use client";

import React, { FormEvent, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { InputField } from "@/components/input/InputField";
import { StarRating } from "@/components/input/StarRating";
import { Button } from "@/components/button/Button";
import { ErrorNotification } from "@/components/notifications/ErrorNotification";
import { SuccessNotification } from "@/components/notifications/SuccessNotification";
import Footer from "@/components/footer/Footer";
import CheckIcon from "@/icons/CheckIcon";
import { useAddReviewStore } from "./store";
import styles from "./addReview.module.scss";

export default function AddReviewPage() {
  const t = useTranslations("AddReview");
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    state,
    setTargetCompany,
    setRating,
    setComment,
    setAttachment,
    setError,
    setSuccess,
    searchCompanies,
    selectCompany,
    hideDropdown,
    submitReview,
  } = useAddReviewStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        hideDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideDropdown]);

  const handleCompanyInput = (value: string) => {
    setTargetCompany(value);
    searchCompanies(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await submitReview();
    if (success) {
      setTimeout(() => {
        router.push("/reviews-profile");
      }, 2000);
    }
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

      <form className={styles.addReview} onSubmit={handleSubmit} noValidate>
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

        <div className={styles.infoInputs}>
          <div className={styles.reviewInput}>
            <div className={styles.inputReview}>
              <InputField
                label={t("companyLabel")}
                placeholder={t("companyPlaceholder")}
                type="autocomplete"
                value={state.form.targetCompany}
                onChange={handleCompanyInput}
                error={state.fieldErrors.targetCompany}
                disabled={!isLoggedIn || state.submitting}
                items={state.search.results.map((company) => ({
                  id: company.id,
                  label: company.name,
                  value: company,
                }))}
                loading={state.search.loading}
                showDropdown={state.search.showDropdown}
                onSelect={(item) => selectCompany(item.value)}
                onClose={hideDropdown}
                loadingText={t("searching")}
                emptyText={t("noCompaniesFound")}
              />

              <StarRating
                label={t("ratingLabel")}
                value={state.form.rating}
                onChange={setRating}
                error={state.fieldErrors.rating}
                disabled={!isLoggedIn}
              />

              <InputField
                type="textarea"
                label={t("experienceLabel")}
                placeholder={t("experiencePlaceholder")}
                value={state.form.comment}
                onChange={setComment}
                error={state.fieldErrors.comment}
                disabled={!isLoggedIn || state.submitting}
                rows={3}
              />
            </div>

            <div className={styles.documentSection}>
              <div className={styles.fileUpload}>
                <label className={styles.label}>{t("documentLabel")}</label>
                <div className={styles.fileInputWrapper}>
                  <Button variant="outline" fullWidth as="label" disabled={!isLoggedIn || state.submitting}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      disabled={!isLoggedIn}
                    />
                    {state.form.attachment ? state.form.attachment.name : t("selectFile")}
                  </Button>
                  <div className={styles.fileInfo}>{t("fileFormats")}</div>
                </div>
              </div>

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

          <Button 
            type={isLoggedIn ? "submit" : "button"}
            fullWidth 
            disabled={isLoggedIn && state.submitting}
            loading={isLoggedIn && state.submitting}
            onClick={!isLoggedIn ? () => router.push(`/${params.locale}/register`) : undefined}
            showArrow={!isLoggedIn}
          >
            {isLoggedIn ? t("submitButton") : t("registerButton")}
          </Button>
        </div>
      </form>
      <Footer />
    </div>
  );
}
