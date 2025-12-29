type UkraineFlagProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function UkraineFlag({ className, width = 28, height = 20 }: UkraineFlagProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 20" fill="none" className={className}>
      <rect width="28" height="20" rx="2" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 10.6667H28V0H0V10.6667Z" fill="#156DD1"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 20.0013H28V10.668H0V20.0013Z" fill="#FFD948"/>
    </svg>
  );
}
