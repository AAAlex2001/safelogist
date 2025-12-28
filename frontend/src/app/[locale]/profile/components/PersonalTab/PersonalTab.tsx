"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import styles from "./PersonalTab.module.scss";
import { useProfile, type UserRole } from "../../store";
import { Button } from "@/components/button/Button";
import { InputField } from "@/components/input/InputField";

export function PersonalTab() {
  const t = useTranslations("Profile");
  const {
    state,
    setFullName,
    setIndustry,
    setPhone,
    setEmail,
    setCompany,
    setPosition,
    setAddress,
    setPhoto,
    setPhotoFile,
  } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  const { personal, loading } = state;

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t("photoSection")}</div>
        <div className={styles.photoSection}>
          <div className={styles.avatar}>
            {personal.photo ? (
              <img src={personal.photo} alt={t("photoAlt")} className={styles.avatarImage} />
            ) : (
              <IdCardIcon />
            )}
          </div>
          <div className={styles.photoActions}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <PictureIcon />
              {t("uploadPhoto")}
            </Button>
            <span className={styles.photoHint}>{t("photoHint")}</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t("personalInfo")}</div>
        <div className={styles.fieldGroup}>
          <InputField
            label={t("name")}
            placeholder={t("namePlaceholder")}
            value={personal.fullName}
            onChange={setFullName}
            variant="white"
          />

          <InputField
            type="select"
            label={t("industry")}
            placeholder={t("industryPlaceholder")}
            value={personal.industry}
            onChange={(val) => setIndustry(val as UserRole | "")}
            options={[
              { value: "TRANSPORT_COMPANY", label: t("industryTransport") },
              { value: "CARGO_OWNER", label: t("industryCargoOwner") },
              { value: "FORWARDER", label: t("industryForwarder") },
              { value: "USER", label: t("industryUser") },
            ]}
            variant="white"
          />

          <InputField
            type="tel"
            label={t("phone")}
            placeholder={t("phonePlaceholder")}
            value={personal.phone}
            onChange={setPhone}
            variant="white"
          />

          <InputField
            type="email"
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            value={personal.email}
            onChange={setEmail}
            disabled
            variant="white"
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t("workInfo")}</div>
        <div className={styles.fieldGroup}>
          <InputField
            label={t("company")}
            placeholder={t("companyPlaceholder")}
            value={personal.company}
            onChange={setCompany}
            variant="white"
          />

          <InputField
            label={t("position")}
            placeholder={t("positionPlaceholder")}
            value={personal.position}
            onChange={setPosition}
            variant="white"
          />

          <InputField
            type="textarea"
            label={t("location")}
            placeholder={t("locationPlaceholder")}
            value={personal.address}
            onChange={setAddress}
            rows={2}
            variant="white"
          />
        </div>
      </div>
    </>
  );
}

function IdCardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7C4 5.89543 4.89543 5 6 5H22C23.1046 5 24 5.89543 24 7V21C24 22.1046 23.1046 23 22 23H6C4.89543 23 4 22.1046 4 21V7Z" stroke="#0D0D0D" strokeWidth="2"/>
      <circle cx="10" cy="12" r="2" stroke="#0D0D0D" strokeWidth="2"/>
      <path d="M7 18C7 16.3431 8.34315 15 10 15C11.6569 15 13 16.3431 13 18" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10H21" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 14H21" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function PictureIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#012AF9" strokeWidth="1.5"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="#012AF9" strokeWidth="1.5"/>
      <path d="M3 16L8 11L13 16" stroke="#012AF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 15L17 12L21 16" stroke="#012AF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
