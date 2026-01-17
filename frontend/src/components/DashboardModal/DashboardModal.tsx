"use client";

import React from "react";
import { RecentActionsIcon } from "@/icons/RecentActionsIcon";
import { StarOutlineIcon } from "@/icons/StarOutlineIcon";
import styles from "./DashboardModal.module.scss";
import type { RecentActionItem, FavouriteItem } from "../DashBoardCard/types";

type DashboardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  variant: "recent-actions" | "favourites";
  items: RecentActionItem[] | FavouriteItem[];
};

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  title,
  variant,
  items,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "recent-actions":
        return <RecentActionsIcon />;
      case "favourites":
        return <StarOutlineIcon />;
      default:
        return null;
    }
  };

  const renderRecentActions = () => {
    const recentItems = items as RecentActionItem[];
    return (
      <div className={styles.itemsList}>
        {recentItems.map((item, index) => (
          <div key={index} className={styles.recentItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemHeader}>
                <div className={styles.companyName}>{item.companyName}</div>
                <div className={styles.statusBadge}>{item.status}</div>
              </div>
              <div className={styles.itemDescription}>{item.description}</div>
              <div className={styles.itemTime}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFavourites = () => {
    const favItems = items as FavouriteItem[];
    return (
      <div className={styles.itemsList}>
        {favItems.map((item, index) => (
          <div key={index} className={styles.favouriteItem}>
            <div className={styles.itemInfo}>
              <div className={styles.favouriteName}>{item.name}</div>
              <div className={styles.itemDescription}>{item.description}</div>
              <div className={styles.itemTime}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            {getIcon()}
            <h2 className={styles.modalTitle}>{title}</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          {variant === "recent-actions" && renderRecentActions()}
          {variant === "favourites" && renderFavourites()}
        </div>
      </div>
    </div>
  );
};
