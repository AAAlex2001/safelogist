type RussiaFlagProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function RussiaFlag({ className, width = 28, height = 20 }: RussiaFlagProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 20" fill="none" className={className}>
      <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5" strokeWidth="0.5"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 13.3346H28V6.66797H0V13.3346Z" fill="#0C47B7"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 19.9987H28V13.332H0V19.9987Z" fill="#E53B35"/>
    </svg>
  );
}
