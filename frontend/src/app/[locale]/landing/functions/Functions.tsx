"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "@/components/Typography";
import styles from "./Functions.module.scss";
import { Tabs } from "@/components/tabs/Tabs";
import {
  SearchCheckIcon,
  DocumentStarIcon,
  AwardIcon,
  UserSearchIcon,
  OfficialSourcesIcon,
  InternationalIcon,
  DossierIcon,
  FastIcon,
} from "@/icons";
import type { FunctionsContent } from "@/types/landing";

type TabId = "WhatYouGet" | "WhyWe";

type Props = {
  content: FunctionsContent;
};

const TAB1_ICONS = [SearchCheckIcon, DocumentStarIcon, AwardIcon, UserSearchIcon];
const TAB2_ICONS = [OfficialSourcesIcon, InternationalIcon, DossierIcon, FastIcon];

export function Functions({ content }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("WhatYouGet");
  const data = content;

  const items = activeTab === "WhatYouGet" ? data.tab1_items : data.tab2_items;
  const icons = activeTab === "WhatYouGet" ? TAB1_ICONS : TAB2_ICONS;

  return (
    <section className={styles.functions}>
      <div className={styles.headings}>
        <Typography as="h1" size={24} desktopSize={24} blue={true} text={data.title} />
        <Typography as="h2" size={18} desktopSize={18} text={data.subtitle} brown={true} />
      </div>
      <div className={styles.TabsContainer}>
        <Tabs
          tabs={[
            { id: "WhatYouGet", label: data.tab1_label },
            { id: "WhyWe", label: data.tab2_label },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabId)}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          layout
        >
          <div className={styles.FunctionsContent}>
            {items.map((item, index) => {
              const Icon = icons[index];
              return (
                <div key={index} className={styles.FunctionsItem}>
                  <div className={styles.FunctionsIcon}>
                    <Icon />
                  </div>
                  <div className={styles.text}>
                    <Typography as="h3" size={18} desktopSize={18} blue={true} text={item.title} />
                    <Typography as="h4" size={16} desktopSize={16} text={item.text} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
