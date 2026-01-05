import React from "react";
import cx from "classnames";
import styles from "./Typography.module.scss";

type TypographyAs = "h1" | "h2" | "h3" | "h4";

type TypographyStyleVars = React.CSSProperties & Record<`--${string}`, string>;

export type TypographyProps = {
  as: TypographyAs;
  text: string;
  size?: number;
  desktopSize?: number;
  blue?: boolean;
  highlight?: string;
  className?: string;
  brown?: boolean;
  weight?: "normal" | "bold";
  white?: boolean;
};

export function Typography({
  as,
  text,
  size,
  desktopSize,
  blue = false,
  highlight,
  className,
  brown = false,
  weight,
  white = false,
}: TypographyProps) {

  const Tag = as;
  const baseClass = as === "h1" || as === "h3" ? styles.h1 : styles.h2;
  const effectiveWeight = weight ?? (as === "h1" || as === "h3" ? "bold" : "normal");
  const combinedClassName = cx(
    baseClass,
    { [styles.blue]: blue, [styles.brown]: brown, [styles.white]: white, [styles.bold]: effectiveWeight === "bold", [styles.normal]: effectiveWeight === "normal" },
    className
  );

  const style: TypographyStyleVars = {};
  if (size) style["--typo-size"] = `${size}px`;
  if (desktopSize) style["--typo-size-desktop"] = `${desktopSize}px`;

  if (highlight && text.includes(highlight)) {
    const [before, ...rest] = text.split(highlight);
    const after = rest.join(highlight);

    return (
      <Tag className={combinedClassName} style={style}>
        {before}
        <span className={styles.highlight}>{highlight}</span>
        {after}
      </Tag>
    );
  }

  return (
    <Tag className={combinedClassName} style={style}>
      {text}
    </Tag>
  );
}
