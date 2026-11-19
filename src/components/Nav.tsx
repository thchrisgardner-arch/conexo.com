"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/content/conexo";
import Logo from "./ui/Logo";
import Button from "./ui/Button";
import s from "./Nav.module.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú mobile: timeline construido una vez, se reproduce / revierte
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" })
        .from("[data-menu-item]", { yPercent: 110, stagger: 0.06, duration: 0.8 }, 0.35)
        .from("[data-menu-foot]", { opacity: 0, y: 20, duration: 0.6 }, 0.55);
    },
    { scope: menu }
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (prefersReducedMotion()) t.progress(open ? 1 : 0).pause();
    else if (open) t.timeScale(1).play();
    else t.timeScale(1.6).reverse();

    document.documentElement.classList.toggle("menu-open", open);
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();

    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`${s.nav} ${scrolled ? s.scrolled : ""} ${open ? s.isOpen : ""}`}>
        <div className={s.bar}>
          <a href="#top" className={s.brand} aria-label="Conexo, ir al inicio">
            <Logo />
          </a>

          <nav aria-label="Principal" className={s.links}>
            {nav.map((item) => (
              <a key={item.href} href={item.href} className={s.link}>
                <span>{item.label}</span>
                <span aria-hidden="true">{item.label}</span>
              </a>
            ))}
          </nav>

          <Button href="#contacto" className={s.cta}>
            Hablemos
          </Button>

          <button
            ref={toggle}
            className={s.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        className={s.menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Menú mobile" className={s.menuNav}>
          {[...nav, { label: "Contacto", href: "#contacto" }].map((item, i) => (
            <span className="line-mask" key={item.href}>
              <a href={item.href} data-menu-item onClick={() => setOpen(false)} className={s.menuLink}>
                <span className="mono">0{i + 1}</span>
                {item.label}
              </a>
            </span>
          ))}
        </nav>
        <div className={s.menuFoot} data-menu-foot>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <p className="mono">{site.tagline}</p>
        </div>
        <svg className={s.menuNodes} viewBox="0 0 200 200" aria-hidden="true">
          <path d="M40 40 L160 70 L110 170 Z" />
          <circle cx="40" cy="40" r="7" fill="var(--blue)" />
          <circle cx="160" cy="70" r="7" fill="var(--black)" />
          <circle cx="110" cy="170" r="7" fill="var(--yellow)" />
        </svg>
      </div>
    </>
  );
}
