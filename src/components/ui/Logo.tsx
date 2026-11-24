/* eslint-disable @next/next/no-img-element -- exportación estática: los logos son archivos oficiales ya optimizados */
import s from "./Logo.module.css";

/**
 * Piezas oficiales del Brand Book (archivos en /public/brand, recortados de los PNG originales).
 * No deformar, no rotar ni recolorear con CSS: elegir la versión de color que corresponde al fondo.
 */
type Tone = "verde" | "oscuro" | "blanco";

const RATIO = {
  logotipo: 314 / 480, // "con" sobre "exo" (pág. 8)
  lockup: 927 / 1200, // logotipo + tagline "ALIADO INTEGRAL DIGITAL" (pág. 9)
  isotipo: 395 / 600, // tres circunferencias unidas (pág. 7)
};

/** Logotipo en dos líneas. `width` en px de pantalla; la altura sale de la proporción oficial. */
export default function Logo({
  tone = "verde",
  width = 92,
  className = "",
}: {
  tone?: Tone;
  width?: number;
  className?: string;
}) {
  return (
    <img
      src={`/brand/logotipo-${tone}.webp`}
      alt="Conexo"
      width={width}
      height={Math.round(width * RATIO.logotipo)}
      className={`${s.img} ${className}`}
      decoding="async"
    />
  );
}

/** Logotipo + tagline, tal como lo muestra la pág. 9. */
export function LogoLockup({
  tone = "verde",
  width = 220,
  className = "",
  loading = "lazy",
}: {
  tone?: Tone;
  width?: number;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <img
      src={`/brand/logotipo-tagline-${tone}.webp`}
      alt="Conexo, aliado integral digital"
      width={width}
      height={Math.round(width * RATIO.lockup)}
      className={`${s.img} ${className}`}
      loading={loading}
      decoding="async"
    />
  );
}

/** Isotipo oficial. Decorativo por defecto (alt vacío). */
export function Isotipo({
  tone = "verde",
  width = 48,
  className = "",
  alt = "",
}: {
  tone?: Tone;
  width?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={`/brand/isotipo-${tone}.webp`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={width}
      height={Math.round(width * RATIO.isotipo)}
      className={`${s.img} ${className}`}
      decoding="async"
    />
  );
}
