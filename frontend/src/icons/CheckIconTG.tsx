type CheckIconTGProps = {
  className?: string;
  size?: number;
};

export default function CheckIconTG({ className, size = 24 }: CheckIconTGProps) {
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
        d="M9.35588 17.6234L4.61455 12.648L3 14.3303L9.35588 21L23 6.68233L21.3968 5L9.35588 17.6234Z"
        fill="currentColor"
      />
    </svg>
  );
}
