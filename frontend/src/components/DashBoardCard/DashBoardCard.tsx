"use client";

import React from "react";
import { Button } from "@/components/button/Button";
import { ThunderIcon } from "@/icons/ThunderIcon";
import { RecentActionsIcon } from "@/icons/RecentActionsIcon";
import { StarOutlineIcon } from "@/icons/StarOutlineIcon";
import { SparkleIcon } from "@/icons/SparkleIcon";
import styles from "./DashBoardCard.module.scss";
import type { DashBoardCardProps, RecentActionItem, FavouriteItem } from "./types";

const DotIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="2" fill="var(--text-secondary)"/>
  </svg>
);

export const DashBoardCard: React.FC<DashBoardCardProps> = ({
  variant,
  title,
  actions,
  items,
  tips,
  showAllText,
  onShowAll,
}) => {
  const getIcon = () => {
    switch (variant) {
      case "quick-actions":
        return <ThunderIcon />;
      case "recent-actions":
        return <RecentActionsIcon />;
      case "favourites":
        return <StarOutlineIcon />;
      case "tips":
        return <SparkleIcon />;
      default:
        return null;
    }
  };

  const renderQuickActions = () => {
    if (!actions) return null;
    return (
      <div className={styles.actionsWrapper}>
        {actions.map((action, index) => (
          <div key={index} className={styles.actionItem}>
            <div className={styles.actionText}>{action.text}</div>
            <Button fullWidth className={styles.actionButton}>
              {action.buttonText}
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderRecentActions = () => {
    if (!items) return null;
    const recentItems = items as RecentActionItem[];
    return (
      <div className={styles.itemsWrapper}>
        <div className={styles.itemsList}>
          {recentItems.slice(0, 2).map((item, index) => (
            <div key={index} className={styles.recentItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemHeader}>
                  <div className={styles.companyName}>{item.companyName}</div>
                  <div className={styles.statusBadge}>
                    {item.status}
                  </div>
                </div>
                <div className={styles.itemDescription}>{item.description}</div>
                <div className={styles.itemTime}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
        {showAllText && (
          <button className={styles.showAllBtn} onClick={onShowAll}>
            {showAllText}
          </button>
        )}
      </div>
    );
  };

  const renderFavourites = () => {
    if (!items) return null;
    const favItems = items as FavouriteItem[];
    return (
      <div className={styles.itemsWrapper}>
        <div className={styles.itemsList}>
          {favItems.slice(0, 2).map((item, index) => (
            <div key={index} className={styles.favouriteItem}>
              <div className={styles.itemInfo}>
                <div className={styles.favouriteName}>{item.name}</div>
                <div className={styles.itemDescription}>{item.description}</div>
                <div className={styles.itemTime}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
        {showAllText && (
          <button className={styles.showAllBtn}>
            {showAllText}
          </button>
        )}
      </div>
    );
  };

  const renderTips = () => {
    if (!tips) return null;
    return (
      <div className={styles.tipsWrapper}>
        {tips.map((tip, index) => (
          <div key={index} className={styles.tipItem}>
            <DotIcon />
            <div className={styles.tipText}>{tip.text}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.header}>
        {getIcon()}
        <h3 className={styles.title}>{title}</h3>
      </div>

      {variant === "quick-actions" && renderQuickActions()}
      {variant === "recent-actions" && renderRecentActions()}
      {variant === "favourites" && renderFavourites()}
      {variant === "tips" && renderTips()}
    </div>
  );
};
