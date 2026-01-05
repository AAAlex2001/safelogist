"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./SearchBar.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type SearchBarProps = {
  placeholder?: string;
  basePath?: string;
};

type Company = {
  id: number;
  name: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Регистрационный / налоговый номер",
  basePath = "/ru/reviews",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const clearResultsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Клик вне компонента - закрыть dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        if (clearResultsTimeout.current) clearTimeout(clearResultsTimeout.current);
        setShowDropdown(false);
        clearResultsTimeout.current = setTimeout(() => {
          setResults([]);
        }, 300);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (clearResultsTimeout.current) clearTimeout(clearResultsTimeout.current);
    };
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setShowDropdown(false);
      if (clearResultsTimeout.current) clearTimeout(clearResultsTimeout.current);
      clearResultsTimeout.current = setTimeout(() => {
        setResults([]);
      }, 300);
      return;
    }

    // Показываем лоадер сразу
    setLoading(true);
    setShowDropdown(true);

    try {
      const response = await fetch(`${API_URL}/api/reviews/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.companies || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    if (clearResultsTimeout.current) {
      clearTimeout(clearResultsTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      window.location.href = `${basePath}/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleResultClick = (companyId: number) => {
    window.location.href = `${basePath}/item/${companyId}`;
  };

  return (
    <div className={styles["search-wrapper"]}>
      <div 
        className={`${styles["search-box"]} ${showDropdown ? styles.expanded : ""}`}
        ref={searchBoxRef}
      >
        <div className={styles["search-input-wrapper"]}>
          <svg className={styles["search-icon"]} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.63876 10.5292C8.33874 10.5292 10.5275 8.34007 10.5275 5.63961C10.5275 2.93915 8.33874 0.75 5.63876 0.75C2.93877 0.75 0.75 2.93915 0.75 5.63961C0.75 8.34007 2.93877 10.5292 5.63876 10.5292Z" stroke="#012AF9" strokeWidth="1.5"/>
            <path d="M9.19531 9.19531L12.7508 12.7514" stroke="#012AF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text" 
            className={styles["search-input"]}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles["search-button"]}
            onClick={handleSubmit}
          >
            Поиск
          </button>
        </div>

        <div className={`${styles["autocomplete-results"]} ${showDropdown ? styles.show : ""}`}>
          {loading ? (
            <div className={styles["autocomplete-item"]} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: '16px', height: '16px', border: '2px solid #012AF9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }}></span>
            </div>
          ) : results.length > 0 ? (
            results.map((company) => (
              <div 
                key={company.id}
                className={styles["autocomplete-item"]}
                onClick={() => handleResultClick(company.id)}
              >
                <span 
                  className={styles["autocomplete-name"]}
                  dangerouslySetInnerHTML={{
                    __html: company.name.replace(
                      new RegExp(`(${query})`, 'gi'),
                      '<strong>$1</strong>'
                    )
                  }}
                />
              </div>
            ))
          ) : query.length >= 2 ? (
            <div className={styles["autocomplete-item"]}>Ничего не найдено</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
