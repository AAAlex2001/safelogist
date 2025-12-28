type CheckIconProps = {
  className?: string;
  size?: number;
};

export default function CheckIcon({ className, size = 16 }: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3359 4.66602L6.66927 11.3327L3.33594 7.99935"
        stroke="#012AF9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
