type USAFlagProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function USAFlag({ className, width = 28, height = 20 }: USAFlagProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 20" fill="none" className={className}>
      <rect width="28" height="20" rx="2" fill="white"/>
      <path d="M28 20H0V18.667H28V20ZM28 17.333H0V16H28V17.333ZM28 14.667H0V13.333H28V14.667ZM28 12H0V10.667H28V12ZM28 9.33301H0V8H28V9.33301ZM28 6.66699H0V5.33301H28V6.66699ZM28 4H0V2.66699H28V4ZM28 1.33301H0V0H28V1.33301Z" fill="#D02F44"/>
      <rect width="12" height="9.33333" fill="#46467F"/>
    </svg>
  );
}
