type UserIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function UserIcon({ className, width = 22, height = 22 }: UserIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 19V17C18 15.9391 17.5786 14.9217 16.8284 14.1716C16.0783 13.4214 15.0609 13 14 13H8C6.93913 13 5.92172 13.4214 5.17157 14.1716C4.42143 14.9217 4 15.9391 4 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 10C13.2091 10 15 8.20914 15 6C15 3.79086 13.2091 2 11 2C8.79086 2 7 3.79086 7 6C7 8.20914 8.79086 10 11 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
