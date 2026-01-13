"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./SearchBar.module.scss";
import SearchIcon from "../../icons/SearchIcon";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Company = {
  id: number;
  name: string;
  reviews_count?: number;
};

type SearchBarProps = {
  placeholder?: string;
  reviewsBasePath?: string;
  disabled?: boolean;
  /** Inline mode - вызывает onSearch callback вместо показа dropdown */
  onSearch?: (results: Company[], loading: boolean, query: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  reviewsBasePath,
  disabled = false,
  onSearch,
}) => {
  const t = useTranslations("SearchBar");
  const params = useParams<{ locale?: string }>();
  const localeFromParams = typeof params?.locale === "string" ? params.locale : undefined;
  const localeFromPath = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : undefined;
  const locale = localeFromParams || localeFromPath || "ru";

  const resolvedReviewsBasePath =
    reviewsBasePath ?? (API_URL ? `${API_URL}/${locale}/reviews` : `/${locale}/reviews`);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const clearResultsTimeout = useRef<NodeJS.Timeout | null>(null);
  // `disabled` comes from props; when true the search is non-interactive

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
      if (onSearch) {
        onSearch([], false, searchQuery);
        return;
      }
      setShowDropdown(false);
      if (clearResultsTimeout.current) clearTimeout(clearResultsTimeout.current);
      clearResultsTimeout.current = setTimeout(() => {
        setResults([]);
      }, 300);
      return;
    }

    setLoading(true);
    if (onSearch) {
      onSearch([], true, searchQuery);
    } else {
      setShowDropdown(true);
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        const companies = data.companies || [];
        if (onSearch) {
          onSearch(companies, false, searchQuery);
        } else {
          setResults(companies);
        }
      } else {
        if (onSearch) {
          onSearch([], false, searchQuery);
        } else {
          setResults([]);
        }
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
      if (onSearch) {
        onSearch([], false, searchQuery);
      } else {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
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
    if (disabled) return;
    if (query.trim()) {
      window.location.href = `${resolvedReviewsBasePath}/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleResultClick = (companyId: number) => {
    window.location.href = `${resolvedReviewsBasePath}/item/${companyId}`;
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
            placeholder={placeholder ?? t("placeholder")}
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            readOnly={disabled}
          />
          <button 
            className={styles.searchButton}
            onClick={handleSubmit}
            disabled={disabled}
          >
            {t("button")}
          </button>
        </div>

        <div className={`${styles.autocompleteResults} ${showDropdown && !onSearch ? styles.show : ""}`}>
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
