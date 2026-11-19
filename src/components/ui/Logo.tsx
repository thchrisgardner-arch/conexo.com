import s from "./Logo.module.css";

/** Isotipo: los tres pilares conectados (web · automatización · soporte). */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={`${s.mark} ${className}`} viewBox="0 0 24 22" aria-hidden="true">
      <path d="M12 3 L21 18.5 L3 18.5 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="3" r="3" fill="var(--blue)" />
      <circle cx="21" cy="18.5" r="3" fill="var(--green)" />
      <circle cx="3" cy="18.5" r="3" fill="var(--yellow)" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`${s.logo} ${className}`}>
      <Mark />
      <span className={s.word}>Conexo</span>
    </span>
  );
}
