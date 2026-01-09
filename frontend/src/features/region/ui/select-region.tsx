'use client'
import { useState } from 'react';
import cls from './select-region.module.scss'

type Props = {

}

function SelectRegion(props: Props) {
  const {} = props

  const [showRegionPanel, setShowRegionPanel] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<"СНГ" | "Европа">("СНГ");

  const handleRegionChange = (region: "СНГ" | "Европа") => {
    setSelectedRegion(region);
    setShowRegionPanel(false);
  };

  return (
    <div className={cls.regionSelector}>
      <button
        className={`${cls.regionButton} ${showRegionPanel ? cls.regionButtonOpen : ""}`}
        onClick={() => setShowRegionPanel(!showRegionPanel)}
      >
        <span>Регион поиска: {selectedRegion}</span>
        <svg
          className={`${cls.regionArrow} ${showRegionPanel ? cls.regionArrowOpen : ""}`}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M4.5 6.75L9 11.25L13.5 6.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showRegionPanel && (
        <div className={cls.regionDropdown}>
          <button 
            className={cls.regionOption}
            onClick={() => handleRegionChange(selectedRegion === "СНГ" ? "Европа" : "СНГ")}
          >
            Регион поиска: {selectedRegion === "СНГ" ? "Европа" : "СНГ"}
          </button>
        </div>
      )}
    </div>
  )
}

export { SelectRegion }