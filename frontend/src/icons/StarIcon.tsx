type StarIconProps = {
  className?: string;
  size?: number;
  filled?: boolean;
};

export default function StarIcon({
  className,
  size = 24,
  filled = false,
}: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.9945 17.2717L16.1445 19.7817C16.9045 20.2417 17.8345 19.5617 17.6345 18.7017L16.5345 13.9817L20.2045 10.8017C20.8745 10.2217 20.5145 9.12172 19.6345 9.05172L14.8045 8.64172L12.9145 4.18172C12.5745 3.37172 11.4145 3.37172 11.0745 4.18172L9.18446 8.63172L4.35446 9.04172C3.47446 9.11172 3.11446 10.2117 3.78446 10.7917L7.45446 13.9717L6.35446 18.6917C6.15446 19.5517 7.08446 20.2317 7.84446 19.7717L11.9945 17.2717Z"
        fill={filled ? "#FFD500" : "#D9D9D9"}
      />
    </svg>
  );
}
