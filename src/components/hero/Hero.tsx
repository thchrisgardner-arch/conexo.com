"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import { site, stats } from "@/content/conexo";
import NodeField from "./NodeField";
import Button from "../ui/Button";
import Connector from "../ui/Connector";
import s from "./Hero.module.css";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, reduce: MQ.reduce, fine: MQ.fine }, (ctx) => {
        const { motion, fine } = ctx.conditions as Record<string, boolean>;

        if (!motion) {
          gsap.set("[data-line] > span", { yPercent: 0, y: 0 });
          gsap.set("[data-fade]", { opacity: 1, y: 0 });
          gsap.set("[data-shape]", { opacity: 1, scale: 1 });
          return;
        }

        // Entrada después de la intro
        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        intro
          .fromTo("[data-line] > span", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.09 })
          .fromTo("[data-shape]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, stagger: 0.07, ease: "back.out(1.6)" }, 0.35)
          .to("[data-fade]", { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.5)
          .from("[data-stat]", { textContent: 0, duration: 1.4, snap: { textContent: 1 }, ease: "power2.out" }, 0.6);
        const off = onReady(() => intro.play());

        // Salida con scroll: el titular se aleja mientras la intro lo cubre
        gsap.to("[data-inner]", {
          yPercent: -12,
          scale: 0.94,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // Parallax de formas con el cursor
        if (fine) {
          const shapes = gsap.utils.toArray<HTMLElement>("[data-shape]");
          const setters = shapes.map((el) => ({
            depth: Number(el.dataset.depth ?? 1),
            x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
          }));
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            setters.forEach((st) => {
              st.x(nx * 60 * st.depth);
              st.y(ny * 40 * st.depth);
            });
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => {
            off();
            window.removeEventListener("pointermove", onMove);
          };
        }
        return off;
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className={s.hero} aria-labelledby="hero-title">
      <NodeField className={s.canvas} />

      <div className={s.shapes} aria-hidden="true">
        <span data-shape data-depth="1.4" className={`${s.shape} ${s.pill}`} />
        <span data-shape data-depth="-0.8" className={`${s.shape} ${s.square}`} />
        <span data-shape data-depth="1" className={`${s.shape} ${s.ring}`} />
      </div>

      <div className={`container ${s.inner}`} data-inner>
        <div className={s.top} data-fade>
          <p className="mono">
            <span className={s.live} aria-hidden="true" /> Desarrollo web · Automatización · Soporte
          </p>
        </div>

        <h1 id="hero-title" className={`display ${s.title}`}>
          <span className={`line-mask ${s.l1}`} data-line>
            <span>Tu aliado</span>
          </span>
          <span className={`line-mask ${s.l2}`} data-line>
            <span>digital para</span>
          </span>
          <span className={`line-mask ${s.l3}`} data-line>
            <span>
              crecer <Connector /> sin
            </span>
          </span>
          <span className={`line-mask ${s.l4}`} data-line>
            <span>
              fricciones<span className={s.dot}>.</span>
            </span>
          </span>
        </h1>

        <div className={s.bottom}>
          <p className={s.lead} data-fade>
            {site.description}
          </p>
          <div className={s.ctas} data-fade>
            <Button href="#contacto" size="lg">
              Hablemos
            </Button>
            <Button href="#proyectos" variant="outline" size="lg">
              Ver proyectos
            </Button>
          </div>
        </div>

        <ul className={s.stats} data-fade>
          {stats.map((st) => {
            const m = st.value.match(/^(\d+)(.*)$/);
            return (
              <li key={st.label}>
                <strong>
                  {m ? (
                    <>
                      <span data-stat>{m[1]}</span>
                      {m[2]}
                    </>
                  ) : (
                    st.value
                  )}
                </strong>
                <span className="mono">{st.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
