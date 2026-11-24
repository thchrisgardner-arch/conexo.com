import { nav, site } from "@/content/conexo";
import { LogoLockup } from "./ui/Logo";
import s from "./Footer.module.css";

/**
 * Footer completo sobre el degradado Icónico (Brand Book pág. 14), con el
 * logotipo + tagline blanco como en la aplicación en valla (pág. 23).
 * Todo va centrado para quedar sobre la zona azul profundo / negra del
 * degradado y no sobre los brillos verde lima de las esquinas.
 */
export default function Footer() {
  const links = [...nav, { label: "Contacto", href: "#contacto" }];
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <LogoLockup tone="blanco" width={300} className={s.logo} />

        <nav aria-label="Pie de página">
          <ul className={s.links}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="u-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <address className={s.contact}>
          <a href={`mailto:${site.email}`} className="u-link">
            {site.email}
          </a>
          <a href={site.phoneHref} className="u-link">
            {site.phone}
          </a>
        </address>

        <div className={s.legal}>
          <span className="mono">© {new Date().getFullYear()} Conexo</span>
          <a href="#top" className={`mono ${s.top}`}>
            Volver arriba ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
