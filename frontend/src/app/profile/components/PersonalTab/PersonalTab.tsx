"use client";

import { useEffect } from "react";
import styles from "./PersonalTab.module.scss";
import { usePersonalStore } from "../../store/usePersonalStore";

export function PersonalTab() {
  const {
    state,
    loadProfile,
    setFullName,
    setIndustry,
    setPhone,
    setEmail,
    setCompany,
    setPosition,
    setAddress,
  } = usePersonalStore();

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Profile photo card */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Фотография профиля</div>
        <div className={styles.photoSection}>
          <div className={styles.avatar}>
            <IdCardIcon />
          </div>
          <div className={styles.photoActions}>
            <button className={styles.uploadBtn} type="button">
              <PictureIcon />
              Загрузить фото
            </button>
            <span className={styles.photoHint}>JPG или PNG. Максимум 2 МБ.</span>
          </div>
        </div>
      </div>

      {/* Personal info card */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Личная информация</div>
        <div className={styles.fieldGroup}>
          {/* Name */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Имя</label>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Ваше имя"
              value={state.fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Industry / Role */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Род деятельности</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.selectField}
                value={state.industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Транспортная компания</option>
                <option value="TRANSPORT_COMPANY">Транспортная компания</option>
                <option value="CARGO_OWNER">Грузовладелец</option>
                <option value="FORWARDER">Экспедитор</option>
                <option value="USER">Пользователь</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Номер телефона</label>
            <div className={styles.phoneInput}>
              <RuFlagIcon />
              <span className={styles.phoneCode}>+7</span>
              <PhoneArrowIcon />
              <input
                type="tel"
                className={styles.phoneNumber}
                placeholder="Введите номер телефона"
                value={state.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className={styles.fieldWrapper}>
            <div className={styles.emailLabelRow}>
              <label className={styles.fieldLabel}>Электронная почта</label>
              <div className={styles.verifiedBadge}>
                <span className={styles.verifiedText}>Подтверждена</span>
                <VerifiedIcon />
              </div>
            </div>
            <input
              type="email"
              className={styles.fieldInput}
              placeholder="username@example.com"
              value={state.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Work info card */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Рабочая информация</div>
        <div className={styles.fieldGroup}>
          {/* Company */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Компания</label>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Введите название"
              value={state.company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* Position */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Должность</label>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Финансовый директор"
              value={state.position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Местоположение организации</label>
            <div className={styles.locationInput}>
              <LocationIcon />
              <textarea
                className={styles.locationText}
                placeholder="г. Москва, Новокузнецкая, 1, стр. 112"
                value={state.address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Icons */
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

function RuFlagIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="14" height="10" rx="1" fill="white"/>
      <rect y="3.33" width="14" height="3.34" fill="#0C47B7"/>
      <rect y="6.67" width="14" height="3.33" fill="#E53B35"/>
    </svg>
  );
}

function PhoneArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L7.5 9.5L11 6" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#1AB580"/>
      <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10.625C11.3807 10.625 12.5 9.50571 12.5 8.125C12.5 6.74429 11.3807 5.625 10 5.625C8.61929 5.625 7.5 6.74429 7.5 8.125C7.5 9.50571 8.61929 10.625 10 10.625Z" stroke="#8C8C8C" strokeWidth="1.5"/>
      <path d="M10 17.5C10 17.5 16.25 12.9167 16.25 8.125C16.25 4.67322 13.4518 1.875 10 1.875C6.54822 1.875 3.75 4.67322 3.75 8.125C3.75 12.9167 10 17.5 10 17.5Z" stroke="#8C8C8C" strokeWidth="1.5"/>
    </svg>
  );
}

