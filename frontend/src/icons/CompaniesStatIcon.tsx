import React, { useId } from "react";

type Props = {
  className?: string;
  width?: number;
  height?: number;
};

export default function CompaniesStatIcon({ className, width = 65, height = 65 }: Props) {
  const clipId = useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 65 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M57.3811 2.11241C56.21 1.49065 54.84 1.35949 53.5722 1.74775C52.3045 2.13601 51.2428 3.01191 50.6208 4.18281L26.4746 49.6453L11.7622 38.2509C11.2431 37.8489 10.6499 37.553 10.0165 37.3802C9.38309 37.2075 8.72186 37.1611 8.07055 37.2439C6.75516 37.4111 5.56006 38.0939 4.74815 39.1422C3.93624 40.1906 3.57403 41.5185 3.74119 42.8339C3.90835 44.1492 4.5912 45.3443 5.63952 46.1562L24.9569 61.1162C24.9569 61.1162 25.5086 61.513 25.7595 61.6466C26.3394 61.9547 26.9744 62.1456 27.6281 62.2083C28.2818 62.271 28.9414 62.2043 29.5694 62.012C30.1973 61.8197 30.7812 61.5056 31.2877 61.0877C31.7942 60.6697 32.2134 60.1561 32.5214 59.5761L59.4515 8.87268C60.0732 7.70163 60.2044 6.33157 59.8161 5.06382C59.4279 3.79607 58.552 2.73444 57.3811 2.11241Z"
          fill="currentColor"
          fillOpacity="0.05"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="60" height="60" fill="white" transform="translate(0 5.23047) rotate(-5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
