import React from "react";

interface PlusIconProps {
  size?: number;
  className?: string;
}

export default function PlusIcon({ size = 24, className }: PlusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2.49219V21.5073M2.41406 11.9997H21.4292"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
