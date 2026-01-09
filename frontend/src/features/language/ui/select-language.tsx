'use client'
import GlobeIcon from '@/icons/GlobeIcon'
import cls from './select-language.module.scss'
import RussiaFlag from '@/icons/flags/RussiaFlag'
import USAFlag from '@/icons/flags/USAFlag'
import RomaniaFlag from '@/icons/flags/RomaniaFlag'
import UkraineFlag from '@/icons/flags/UkraineFlag'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

type Props = {

}

const LANGS = ["ru", "en", "ro", "uk"] as const;
type Lang = (typeof LANGS)[number];

function SelectLanguage(props: Props) {
  const {} = props


  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const [showLangPanel, setShowLangPanel] = useState(false);

  const handleLangChange = (lang: Lang) => {
    router.push(pathname, { locale: lang });
    setShowLangPanel(false);
  };

  useEffect(() => {
    const handleClick = () => setShowLangPanel(false);
    if (showLangPanel) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showLangPanel]);


  const currentLang = locale as Lang;

  return (
    <div className={cls.langContainer}>
      <button
        className={cls.langBtn}
        aria-label="Сменить язык"
        onClick={() => setShowLangPanel(!showLangPanel)}
      >
        <GlobeIcon />
        <span>{currentLang.toUpperCase()}</span>
      </button>

      {showLangPanel && (
        <div className={cls.langDropdown}>
          <button
            className={cls.langOption}
            onClick={() => handleLangChange("ru")}
          >
            <RussiaFlag />
            <span>RU</span>
          </button>
          <button
            className={cls.langOption}
            onClick={() => handleLangChange("en")}
          >
            <USAFlag />
            <span>EN</span>
          </button>
          <button
            className={cls.langOption}
            onClick={() => handleLangChange("ro")}
          >
            <RomaniaFlag />
            <span>RO</span>
          </button>
          <button
            className={cls.langOption}
            onClick={() => handleLangChange("uk")}
          >
            <UkraineFlag />
            <span>UK</span>
          </button>
        </div>
      )}
    </div>
  )
}

export { SelectLanguage }