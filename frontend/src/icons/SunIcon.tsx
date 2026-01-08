type SunIconProps = {
  className?: string;
  size?: number;
};

export default function SunIcon({ className, size = 22 }: SunIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11 3V1M11 21V19M19 11H21M1 11H3M16.657 5.343L18.07 3.93M3.93 18.07L5.344 16.656M5.344 5.342L3.93 3.93M18.07 18.07L16.656 16.656M11 16C12.3261 16 13.5979 15.4732 14.5355 14.5355C15.4732 13.5979 16 12.3261 16 11C16 9.67392 15.4732 8.40215 14.5355 7.46447C13.5979 6.52678 12.3261 6 11 6C9.67392 6 8.40215 6.52678 7.46447 7.46447C6.52678 8.40215 6 9.67392 6 11C6 12.3261 6.52678 13.5979 7.46447 14.5355C8.40215 15.4732 9.67392 16 11 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
