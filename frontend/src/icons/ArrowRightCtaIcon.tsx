import React from "react";

type Props = {
  className?: string;
};

export default function ArrowRightCtaIcon({ className }: Props) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M26.5 16L17.5 25M26.5 16L17.5 7M26.5 16H5.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
