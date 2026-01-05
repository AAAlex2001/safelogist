"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./SearchBar.module.scss";
import SearchIcon from "../../icons/SearchIcon";

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
    <div className={styles.searchWrapper}>
      <div 
        className={`${styles.searchBox} ${showDropdown ? styles.expanded : ""}`}
        ref={searchBoxRef}
      >
        <div className={styles.searchInputWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.searchButton}
            onClick={handleSubmit}
          >
            Поиск
          </button>
        </div>

        <div className={`${styles.autocompleteResults} ${showDropdown ? styles.show : ""}`}>
          {loading ? (
            <div className={styles.autocompleteItem} style={{ justifyContent: 'center' }}>
              <span className={styles.loader}></span>
            </div>
          ) : results.length > 0 ? (
            results.map((company) => (
              <div 
                key={company.id}
                className={styles.autocompleteItem}
                onClick={() => handleResultClick(company.id)}
              >
                <span 
                  className={styles.autocompleteName}
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
            <div className={styles.autocompleteItem}>Ничего не найдено</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
