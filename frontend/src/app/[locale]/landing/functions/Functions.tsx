"use client";

import {useState} from "react";
import { Typography } from "@/components/Typography";
import styles from "./Functions.module.scss";
import {Tabs} from "@/components/tabs/Tabs";
import { useTranslations } from "next-intl";
import {InputField} from "@/components/input/InputField";

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
              <Typography
                as="h1"
                size={18}
                desktopSize={18}
                blue={true}
                text="Проверка компаний"
              />
              <Typography
                as="h2"
                size={16}
                desktopSize={16}
                text="Судебные дела, регистрация и ключевые показатели за минуту"
              />
            </div>
            <div className={styles.FunctionsItem}>
              <Typography
                as="h1"
                size={18}
                desktopSize={18}
                blue={true}
                text="Репутация и отзывы"
              />
              <Typography
                as="h2"
                size={16}
                desktopSize={16}
                text="13M+ модерируемых отзывов для оценки надёжности"
              />
            </div>
            <div className={styles.FunctionsItem}>
              <Typography
                as="h1"
                size={18}
                desktopSize={18}
                blue={true}
                text="Риски и судебные дела"
                />
              <Typography
                as="h2"
                size={16}
                desktopSize={16}
                text="Активные процессы, производства и финансовые сигналы"
                />
            </div>
            <div className={styles.FunctionsItem}>
              <Typography
                as="h1"
                size={18}
                desktopSize={18}
                blue={true}
                text="Связанные лица"
                />
              <Typography
                as="h2"
                size={16}
                desktopSize={16}
                text="Бенефициары, аффилированность и структура собственности"
                />
            </div>
          </div>
        )}
    </section>
  );
}
