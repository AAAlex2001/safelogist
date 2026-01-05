type IconProps = { className?: string; size?: number };

export default function FastIcon({ className, size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g opacity={0.3}>
        <path d="M26.5255 5.40454C27.307 4.41604 26.5705 3.00004 25.2715 3.00004H15.1975C14.9248 2.99805 14.6561 3.06627 14.4173 3.19814C14.1785 3.33002 13.9776 3.52111 13.834 3.75304L6.21103 16.437C5.60953 17.436 6.36553 18.6825 7.57303 18.6825H12.7165L7.87153 30.78C7.17103 32.31 9.06403 33.7095 10.336 32.6025L29.9995 13.9965H19.726L26.5255 5.40454Z" stroke="#012AF9" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}
