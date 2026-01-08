type SearchIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function SearchIcon({ className, width = 22, height = 22 }: SearchIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.63876 10.5292C8.33874 10.5292 10.5275 8.34007 10.5275 5.63961C10.5275 2.93915 8.33874 0.75 5.63876 0.75C2.93877 0.75 0.75 2.93915 0.75 5.63961C0.75 8.34007 2.93877 10.5292 5.63876 10.5292Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.19531 9.19531L12.7508 12.7514"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
