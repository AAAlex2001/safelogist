type GlobeIconProps = {
  className?: string;
  size?: number;
};

export default function GlobeIcon({ className, size = 22 }: GlobeIconProps) {
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
        d="M1.66667 7.66667H20.3333M1.66667 14.3333H20.3333M1 11C1 12.3132 1.25866 13.6136 1.7612 14.8268C2.26375 16.0401 3.00035 17.1425 3.92893 18.0711C4.85752 18.9997 5.95991 19.7363 7.17317 20.2388C8.38642 20.7413 9.68678 21 11 21C12.3132 21 13.6136 20.7413 14.8268 20.2388C16.0401 19.7363 17.1425 18.9997 18.0711 18.0711C18.9997 17.1425 19.7363 16.0401 20.2388 14.8268C20.7413 13.6136 21 12.3132 21 11C21 8.34784 19.9464 5.8043 18.0711 3.92893C16.1957 2.05357 13.6522 1 11 1C8.34784 1 5.8043 2.05357 3.92893 3.92893C2.05357 5.8043 1 8.34784 1 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4423 1C8.5705 3.99957 7.57813 7.46429 7.57812 11C7.57813 14.5357 8.5705 18.0004 10.4423 21M11.5535 1C13.4253 3.99957 14.4177 7.46429 14.4177 11C14.4177 14.5357 13.4253 18.0004 11.5535 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
