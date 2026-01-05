"use client";

import {useState} from "react";
import { Typography } from "@/components/Typography";
import styles from "./Functions.module.scss";
import {Tabs} from "@/components/tabs/Tabs";
import { useTranslations } from "next-intl";
import { SearchCheckIcon, DocumentStarIcon, AwardIcon, UserSearchIcon, OfficialSourcesIcon, InternationalIcon, DossierIcon, FastIcon } from '@/icons';

type TabId = "WhatYouGet" | "WhyWe";

export function Functions() {
  const [activeTab, setActiveTab] = useState<TabId>("WhatYouGet");
  const t = useTranslations("Hero");

  return (
    <section className={styles.functions}>
      <div className={styles.headings}>
        <Typography
          as="h1"
          size={24}
          desktopSize={24}
          blue={true}
          text="Почему SafeLogist используют для проверки компаний"
        />
        <Typography
          as="h2"
          size={18}
          desktopSize={18}
          text="Один сервис вместо десятков реестров и ручной проверки"
          brown={true}
        />
      </div>
        <div className={styles.TabsContainer}>
        <Tabs
          tabs={[
            { id: "WhatYouGet", label: t("WhatYouGetTab") },
            { id: "WhyWe", label: t("WhyWeTab") },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabId)}
        />
        </div>
        {activeTab === "WhatYouGet" && (
          <div className={styles.FunctionsContent}>
            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <SearchCheckIcon />
              </div>
              <div className={styles.text}>
                <Typography
                  as="h3"
                  size={18}
                  desktopSize={18}
                  blue={true}
                  text="Проверка компаний"
                />
                <Typography
                  as="h4"
                  size={16}
                  desktopSize={16}
                  text="Судебные дела, регистрация и ключевые показатели за минуту"
                />
              </div>
            </div>
            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <DocumentStarIcon />
              </div>
              <div className={styles.text}>
                <Typography
                  as="h3"
                  size={18}
                  desktopSize={18}
                  blue={true}
                  text="Репутация и отзывы"
                />
                <Typography
                  as="h4"
                  size={16}
                  desktopSize={16}
                  text="13M+ модерируемых отзывов для оценки надёжности"
                />
              </div>
            </div>
            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <AwardIcon />
              </div>
              <div className={styles.text}>
                <Typography
                  as="h3"
                  size={18}
                  desktopSize={18}
                  blue={true}
                  text="Риски и судебные дела"
                />
                <Typography
                  as="h4"
                  size={16}
                  desktopSize={16}
                  text="Активные процессы, производства и финансовые сигналы"
                />
              </div>
            </div>
            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <UserSearchIcon />
              </div>
              <div className={styles.text}>
                <Typography
                  as="h3"
                  size={18}
                  desktopSize={18}
                  blue={true}
                  text="Связанные лица"
                />
                <Typography
                  as="h4"
                  size={16}
                  desktopSize={16}
                  text="Бенефициары, аффилированность и структура собственности"
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === "WhyWe" && (
          <div className={styles.FunctionsContent}>
            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <OfficialSourcesIcon />
              </div>
              <div className={styles.text}>
                  <Typography
                    as="h3"
                    size={18}
                    desktopSize={18}
                    blue={true}
                    text="Официальные источники"
                  />
                  <Typography
                    as="h4"
                    size={16}
                    desktopSize={16}
                    text="Только государственные реестры и проверенные базы данных"
                  />
              </div>
            </div>

            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <InternationalIcon />
              </div>
              <div className={styles.text}>
                  <Typography
                    as="h3"
                    size={18}
                    desktopSize={18}
                    blue={true}
                    text="Международная проверка"
                  />
                  <Typography
                    as="h4"
                    size={16}
                    desktopSize={16}
                    text="Ваш международный бизнес — в одной системе. 18 стран, одна платформа, полная прозрачность."
                  />
              </div>
            </div>

            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <DossierIcon />
              </div>
              <div className={styles.text}>
                  <Typography
                    as="h3"
                    size={18}
                    desktopSize={18}
                    blue={true}
                    text="Полная картина в одном досье"
                  />
                  <Typography
                    as="h4"
                    size={16}
                    desktopSize={16}
                    text="Суды, финансы, связи и репутация — без ручного поиска"
                  />
              </div>
            </div>

            <div className={styles.FunctionsItem}>
              <div className={styles.FunctionsIcon}>
                <FastIcon />
              </div>
              <div className={styles.text}>
                  <Typography
                    as="h3"
                    size={18}
                    desktopSize={18}
                    blue={true}
                    text="Быстро и понятно"
                  />
                  <Typography
                    as="h4"
                    size={16}
                    desktopSize={16}
                    text="Введите налоговый/регистрационный номер — отчёт формируется за секунды"
                  />
              </div>
            </div>
          </div>
        )}
    </section>
  );
}
