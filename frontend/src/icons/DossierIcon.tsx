type IconProps = { className?: string; size?: number };

export default function DossierIcon({ className, size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g opacity={0.3}>
        <path d="M21.1406 4V10.2222C21.1406 10.6348 21.3062 11.0304 21.6009 11.3222C21.8956 11.6139 22.2953 11.7778 22.7121 11.7778H28.9978" stroke="#012AF9" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25.8571 32H10.1429C9.30932 32 8.50992 31.6722 7.92052 31.0888C7.33112 30.5053 7 29.714 7 28.8889V7.11111C7 6.28599 7.33112 5.49467 7.92052 4.91122C8.50992 4.32778 9.30932 4 10.1429 4H21.1429L29 11.7778V28.8889C29 29.714 28.6689 30.5053 28.0795 31.0888C27.4901 31.6722 26.6907 32 25.8571 32Z" stroke="#012AF9" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.2891 22.6658L16.4319 25.7769L22.7176 19.5547" stroke="#012AF9" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}
