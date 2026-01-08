type NotificationIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function NotificationIcon({ className, width = 22, height = 22 }: NotificationIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16.5 9C16.5 7.27609 15.8152 5.62279 14.5962 4.40381C13.3772 3.18482 11.7239 2.5 10 2.5C8.27609 2.5 6.62279 3.18482 5.40381 4.40381C4.18482 5.62279 3.5 7.27609 3.5 9C3.5 17 0 19.25 0 19.25H20C20 19.25 16.5 17 16.5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.4375 23.75C11.2672 24.0526 11.0199 24.3051 10.7213 24.4826C10.4227 24.6601 10.0836 24.7559 9.7375 24.7559C9.39136 24.7559 9.05231 24.6601 8.75369 24.4826C8.45507 24.3051 8.20777 24.0526 8.0375 23.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
