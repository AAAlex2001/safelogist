type SearchCheckIconProps = {
  className?: string;
  size?: number;
};

export default function SearchCheckIcon({ className, size = 36 }: SearchCheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g opacity={0.3}>
        <path d="M31.5 31.5L22.5 22.5M4.5 15C4.5 16.3789 4.77159 17.7443 5.29927 19.0182C5.82694 20.2921 6.60036 21.4496 7.57538 22.4246C8.55039 23.3996 9.70791 24.1731 10.9818 24.7007C12.2557 25.2284 13.6211 25.5 15 25.5C16.3789 25.5 17.7443 25.2284 19.0182 24.7007C20.2921 24.1731 21.4496 23.3996 22.4246 22.4246C23.3996 21.4496 24.1731 20.2921 24.7007 19.0182C25.2284 17.7443 25.5 16.3789 25.5 15C25.5 13.6211 25.2284 12.2557 24.7007 10.9818C24.1731 9.70791 23.3996 8.55039 22.4246 7.57538C21.4496 6.60036 20.2921 5.82694 19.0182 5.29926C17.7443 4.77159 16.3789 4.5 15 4.5C13.6211 4.5 12.2557 4.77159 10.9818 5.29926C9.70791 5.82694 8.55039 6.60036 7.57538 7.57538C6.60036 8.55039 5.82694 9.70791 5.29927 10.9818C4.77159 12.2557 4.5 13.6211 4.5 15Z" stroke="#012AF9" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 15L13.5 18L19.5 12" stroke="#012AF9" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
