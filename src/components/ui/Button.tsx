import type { AnchorHTMLAttributes, ReactNode } from "react";
import s from "./Button.module.css";

type Variant = "green" | "paper" | "ink" | "outline";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  arrow?: boolean;
};

/** Botón-enlace con flecha que se desplaza y relleno que sube al hover. */
export default function Button({
  children,
  variant = "green",
  size = "md",
  arrow = true,
  className = "",
  ...rest
}: Props) {
  return (
    <a className={`${s.btn} ${s[variant]} ${s[size]} ${className}`} {...rest}>
      <span className={s.fill} aria-hidden="true" />
      <span className={s.label} data-text={typeof children === "string" ? children : undefined}>
        <span>{children}</span>
      </span>
      {arrow && (
        <span className={s.arrow} aria-hidden="true">
          <span>→</span>
          <span>→</span>
        </span>
      )}
    </a>
  );
}
