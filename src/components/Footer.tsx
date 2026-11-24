import { nav, site } from "@/content/conexo";
import { LogoLockup } from "./ui/Logo";
import s from "./Footer.module.css";

export default function Footer() {
  const links = [...nav, { label: "Contacto", href: "#contacto" }];
  return (
    <footer className={s.footer}>
      <div className={`container ${s.grid}`}>
        <div className={s.brand}>
          {/* Logotipo + tagline oficial (Brand Book pág. 9) */}
          <LogoLockup tone="verde" width={250} />
        </div>

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

        <a href="#top" className={`mono ${s.top}`}>
          Volver arriba ↑
        </a>
      </div>

      <div className={`container ${s.base}`}>
        <div className={s.legal}>
          <span className="mono">© {new Date().getFullYear()} Conexo</span>
          <span className="mono">Web · Automatización · Soporte</span>
        </div>
      </div>
    </footer>
  );
}
