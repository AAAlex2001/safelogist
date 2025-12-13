"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./profile.module.scss";
import { useProfileStore } from "./store/useProfile";

export default function ProfilePage() {
  const {
    state,
    loadProfile,
    savePersonal,
    setTab,
    setFullName,
    setIndustry,
    setPhone,
    setEmail,
    setCompany,
    setPosition,
    setAddress,
    setCurrentPassword,
    setNewPassword,
    setRepeatPassword,
    toggleShowNew,
    toggleShowRepeat,
  } = useProfileStore();

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.activeTab === "personal") {
      await savePersonal();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.title}>Профиль</div>
          <div className={styles.subtitle}>
            Управляйте своими личными данными
          </div>
        </header>

        {/* Action buttons */}
        <div className={styles.actions}>
          <Link href="/" className={styles.actionBtn}>
            <ArrowLeftIcon />
            Назад
          </Link>
          <button
            className={`${styles.actionBtn} ${styles.saveBtn}`}
            type="button"
            onClick={handleSave}
            disabled={state.loading}
          >
            <SaveIcon />
            Сохранить
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${state.activeTab === "personal" ? styles.tabActive : ""}`}
            onClick={() => setTab("personal")}
          >
            Личные данные
          </button>
          <button
            className={`${styles.tab} ${state.activeTab === "security" ? styles.tabActive : ""}`}
            onClick={() => setTab("security")}
          >
            Безопасность
          </button>
        </div>

        {/* Personal data tab */}
        {state.activeTab === "personal" && (
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
                  <span className={styles.photoHint}>
                    JPG или PNG. Максимум 2 МБ.
                  </span>
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
        )}

        {/* Security tab */}
        {state.activeTab === "security" && (
          <>
            {/* Password card */}
            <div className={styles.securityCard}>
              <div className={styles.sectionTitle}>Пароль</div>
              <div className={styles.fieldGroup}>
                {/* Current password */}
                <div className={styles.passwordField}>
                  <label className={styles.passwordLabel}>Текущий пароль</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type="password"
                      className={styles.passwordInput}
                      placeholder="****************"
                      value={state.currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* New password */}
                <div className={styles.passwordField}>
                  <label className={styles.passwordLabel}>Новый пароль</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={state.showNew ? "text" : "password"}
                      className={styles.passwordInput}
                      placeholder="****************"
                      value={state.newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={toggleShowNew}
                      aria-label={state.showNew ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {state.showNew ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                </div>

                {/* Repeat password */}
                <div className={styles.passwordField}>
                  <label className={styles.passwordLabel}>Повторите новый пароль</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={state.showRepeat ? "text" : "password"}
                      className={styles.passwordInput}
                      placeholder="****************"
                      value={state.repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={toggleShowRepeat}
                      aria-label={state.showRepeat ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {state.showRepeat ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account actions card */}
            <div className={styles.accountCard}>
              <div className={styles.accountContent}>
                <div className={styles.deleteSection}>
                  <div className={styles.deleteTitle}>Действия с аккаунтом</div>
                  <div className={styles.deleteHint}>
                    Безвозвратно удалить аккаунт и все данные
                  </div>
                </div>
                <button type="button" className={styles.deleteBtn}>
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Icons */
function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3V8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V15H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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

function EyeOpenIcon() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.9974 5.99007C12.9974 7.57892 11.653 8.86693 9.99457 8.86693C8.33617 8.86693 6.99177 7.57892 6.99177 5.99007C6.99177 4.4012 8.33617 3.1132 9.99457 3.1132C11.653 3.11318 12.9974 4.40122 12.9974 5.99007ZM10 0C8.28292 0.00761667 6.5031 0.425633 4.81827 1.22595C3.5673 1.84465 2.34817 2.71755 1.2899 3.79497C0.770133 4.34495 0.107183 5.14132 0 5.991C0.0126667 6.72702 0.802167 7.63548 1.2899 8.18705C2.28228 9.22215 3.46967 10.0707 4.81827 10.7567C6.38945 11.5192 8.12853 11.9582 10 11.9826C11.7187 11.9749 13.4981 11.5521 15.1811 10.7567C16.4321 10.138 17.6518 9.26447 18.7101 8.18705C19.2299 7.63707 19.8928 6.84068 20 5.991C19.9873 5.25498 19.1978 4.34648 18.7101 3.79493C17.7177 2.75983 16.5297 1.91195 15.1811 1.22592C13.6107 0.463983 11.8674 0.0279833 10 0ZM9.99873 1.48747C12.6007 1.48747 14.71 3.50403 14.71 5.99165C14.71 8.47927 12.6007 10.4958 9.99873 10.4958C7.39675 10.4958 5.28748 8.47923 5.28748 5.99165C5.28748 3.50403 7.39675 1.48747 9.99873 1.48747Z" fill="#959595"/>
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.521 0.292786C18.3335 0.105315 18.0792 0 17.814 0C17.5488 0 17.2945 0.105315 17.107 0.292786L1.48 15.9218C1.38449 16.014 1.30831 16.1244 1.2559 16.2464C1.20349 16.3684 1.1759 16.4996 1.17475 16.6324C1.1736 16.7652 1.1989 16.8968 1.24918 17.0197C1.29946 17.1426 1.37371 17.2543 1.4676 17.3482C1.5615 17.4421 1.67315 17.5163 1.79605 17.5666C1.91894 17.6169 2.05062 17.6422 2.1834 17.641C2.31618 17.6399 2.4474 17.6123 2.5694 17.5599C2.69141 17.5075 2.80175 17.4313 2.894 17.3358L18.52 1.70679C18.7075 1.51926 18.8128 1.26495 18.8128 0.999786C18.8128 0.734622 18.7085 0.480314 18.521 0.292786ZM3.108 12.3128L5.668 9.75279C5.59517 9.44536 5.55727 9.13071 5.555 8.81479C5.555 6.43579 7.545 4.50579 10 4.50579C10.286 4.50579 10.564 4.53779 10.835 4.58779L12.038 3.38579C11.3642 3.27569 10.6827 3.21885 10 3.21579C3.44 3.21479 0 8.04579 0 8.81479C0 9.23779 1.057 10.9058 3.108 12.3128ZM16.895 5.31979L14.333 7.87979C14.402 8.18179 14.444 8.49279 14.444 8.81479C14.444 11.1938 12.455 13.1218 10 13.1218C9.716 13.1218 9.44 13.0898 9.171 13.0408L7.967 14.2438C8.609 14.3478 9.283 14.4138 10 14.4138C16.56 14.4138 20 9.58079 20 8.81479C20 8.39079 18.944 6.72479 16.895 5.31979Z" fill="#959595"/>
    </svg>
  );
}
