type RomaniaFlagProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function RomaniaFlag({ className, width = 28, height = 20 }: RomaniaFlagProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 20" fill="none" className={className}>
      <rect width="28" height="20" rx="2" fill="white"/>
      <rect x="13.332" width="14.6667" height="20" fill="#E5253D"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 20H9.33333V0H0V20Z" fill="#0A3D9C"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.33203 20H18.6654V0H9.33203V20Z" fill="#FFD955"/>
    </svg>
  );
}
