"use client";

import React, { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { DashBoardCard } from "@/components/DashBoardCard";
import { DashboardModal } from "@/components/DashboardModal";
import styles from "./dashboard.module.scss";
import type { RecentActionItem, FavouriteItem } from "@/components/DashBoardCard/types";

export default function DashboardPage() {
  const [isRecentModalOpen, setIsRecentModalOpen] = useState(false);
  const [isFavouritesModalOpen, setIsFavouritesModalOpen] = useState(false);

  const recentActions: RecentActionItem[] = [
    {
      companyName: "Отзыв",
      description: 'ООО "Ромашка" ООО "Ромашка" ООО "Ро...',
      time: "2 минуты назад",
      status: "Опубликован",
    },
    {
      companyName: "Отзыв",
      description: 'ООО "Ромашка" ООО "Ромашка" ООО "Ро...',
      time: "2 минуты назад",
      status: "Опубликован",
    },
  ];

  const favourites: FavouriteItem[] = [
    {
      name: 'ООО "Ромашка" ООО "Ромашка" ООО "Ро...',
      description: "Обновлены регистрационные данные",
      time: "2 минуты назад",
    },
    {
      name: 'ООО "Ромашка" ООО "Ромашка" ООО "Ро...',
      description: "Обновлены регистрационные данные",
      time: "2 минуты назад",
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Верхняя секция - заголовки и поиск */}
        <div className={styles.topSection}>
          {/* Заголовки */}
          <div className={styles.headings}>
            <h1 className={styles.h1}>Проверяйте компании перед сделкой</h1>
            <h2 className={styles.h2}>
              Введите название или ИНН компании для поиска
            </h2>
          </div>

          {/* Поисковая строка */}
          <div className={styles.searchBarWrapper}>
            <SearchBar placeholder="Название компании или ИНН" />
          </div>
        </div>

        {/* Быстрые действия */}
        <DashBoardCard
          variant="quick-actions"
          title="Быстрые действия"
          actions={[
            {
              text: "Поделитесь опытом — помогите другим принять решение",
              buttonText: "Оставить отзыв",
            },
            {
              text: "ИИ-помощник подсветит риски, связи и ключевые факты в досье",
              buttonText: "ИИ-анализ досье",
            },
          ]}
        />

        {/* Секция с карточками */}
        <div className={styles.cardsSection}>
          {/* Недавние действия */}
          <DashBoardCard
            variant="recent-actions"
            title="Недавние действия"
            showAllText="Показать все"
            items={recentActions}
            onShowAll={() => setIsRecentModalOpen(true)}
          />

          {/* Избранные компании */}
          <DashBoardCard
            variant="favourites"
            title="Избранные компании"
            showAllText="Показать все"
            items={favourites}
            onShowAll={() => setIsFavouritesModalOpen(true)}
          />

          {/* Полезные советы */}
          <DashBoardCard
            variant="tips"
            title="Полезные советы"
            tips={[
              {
                text: 'Настройте мониторинг для автоматического отслеживания изменений в "Избранных"',
              },
              {
                text: "Экспортируйте досье в удобном формате",
              },
              {
                text: "Используйте ИИ-помощника для анализа сложных данных",
              },
            ]}
          />
        </div>
      </div>

      {/* Модальные окна */}
      <DashboardModal
        isOpen={isRecentModalOpen}
        onClose={() => setIsRecentModalOpen(false)}
        title="Недавние действия"
        variant="recent-actions"
        items={recentActions}
      />

      <DashboardModal
        isOpen={isFavouritesModalOpen}
        onClose={() => setIsFavouritesModalOpen(false)}
        title="Избранные компании"
        variant="favourites"
        items={favourites}
      />
    </div>
  );
}
