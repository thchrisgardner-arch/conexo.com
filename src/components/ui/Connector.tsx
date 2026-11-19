import s from "./Connector.module.css";

/**
 * Glifo de marca: dos nodos unidos por una línea que "viaja".
 * Se usa en línea dentro de titulares para que el texto se conecte.
 */
export default function Connector({
  color = "var(--green)",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <span className={`${s.connector} ${className}`} style={{ ["--c" as string]: color }} aria-hidden="true">
      <span className={s.node} />
      <span className={s.line}>
        <span className={s.pulse} />
      </span>
      <span className={s.node} />
    </span>
  );
}
