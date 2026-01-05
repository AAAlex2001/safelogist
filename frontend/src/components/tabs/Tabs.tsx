"use client";

import styles from "./Tabs.module.scss";
import React from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
